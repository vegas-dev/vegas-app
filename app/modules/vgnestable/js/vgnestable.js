import BaseModule from "../../base-module";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import { mergeDeepObject, normalizeData } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {getSVG} from "../../module-fn";

const NAME = "nestable";
const NAME_KEY = "vg.nestable";

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="nestable"]';

const CLASS_ITEM_DRAGGING = "is-dragging";
const CLASS_ITEM_GHOST = "is-drag-ghost";
const CLASS_PLACEHOLDER = "vg-nestable-placeholder";
const CLASS_PLACEHOLDER_HIDDEN = "vg-nestable-placeholder-hidden";
const CLASS_DRAG_ELEMENT = "vg-nestable-drag-element";
const CLASS_INNER = "vg-nestable-inner";
const CLASS_HANDLE = "vg-nestable-handle";
const CLASS_HANDLE_ICON = "vg-nestable-handle-icon";
const CLASS_COLLAPSE_TOGGLE = "vg-nestable-collapse-toggle";
const CLASS_DROP_TARGET = "is-drop-target";
const CLASS_DROP_DENIED = "is-drop-denied";

const EVENT_KEY_START = `${NAME_KEY}.start`;
const EVENT_KEY_CHANGE = `${NAME_KEY}.change`;
const EVENT_KEY_END = `${NAME_KEY}.end`;
const EVENT_KEY_SAVE = `${NAME_KEY}.save`;
const EVENT_KEY_INIT = `${NAME_KEY}.init`;
const EVENT_KEY_REFRESH = `${NAME_KEY}.refresh`;
const EVENT_KEY_POINTER_DOWN = `${NAME_KEY}.pointerdown`;
const EVENT_KEY_MOVE = `${NAME_KEY}.move`;
const EVENT_KEY_DROP = `${NAME_KEY}.drop`;
const EVENT_KEY_TRANSFER = `${NAME_KEY}.transfer`;
const EVENT_KEY_PLACEHOLDER_MOVE = `${NAME_KEY}.placeholdermove`;
const EVENT_KEY_DESTROY = `${NAME_KEY}.destroy`;

class VGNestable extends BaseModule {
	static _groups = new Map();

	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			listselector: ".vg-nestable-list", // Root/nested list for dnd.
			itemselector: ".vg-nestable-item", // Sortable item selector.
			handleselector: ".vg-nestable-handle", // Drag handle selector.
			idattribute: "data-id", // Item id attribute used by serialize().
			childlistclass: "vg-nestable-list", // Class for auto-created child list.
			handleicon: '', // иконка для хендлера
			indent: 28, // X offset (px), after which item moves into child level.
			maxdepth: 6, // Maximum nesting depth.
			hoverthreshold: 0.18, // Vertical threshold (0..0.5) around hovered item center.
			neighborchangethreshold: 0, // Percentage (0..49) of entering adjacent item before position changes.
			showplaceholder: true, // Show placeholder during drag.
			group: "",
			connect: false,
			accept: null,
			collapse: {
				enabled: true,
				open: true,
				showtext: getSVG("chevron"),
				hidetext: getSVG("chevron")
			},
			callbacks: {
				init: null,
				refresh: null,
				pointerdown: null,
				start: null,
				move: null,
				placeholdermove: null,
				drop: null,
				transfer: null,
				change: null,
				end: null,
				save: null,
				destroy: null
			},
			ajax: {
				route: "",
				method: "post",
				field: "items",
				data: {},
				loader: false,
				once: false,
				output: false,
				timeout: 0
			}
		}, params));

		this._rootList = this._resolveRootList();
		this._draggedItem = null;
		this._placeholder = null;
		this._dragElement = null;
		this._isDragging = false;
		this._startSnapshot = "";
		this._sourceInstance = this;
		this._sourceRoot = null;
		this._currentTargetInstance = this;
		this._lastDropInstance = this;
		this._activeDropList = null;

		this._mouse = {
			startX: 0,
			startY: 0,
			x: 0,
			y: 0
		};

		this._boundOnMouseDown = this._onMouseDown.bind(this);
		this._boundOnMouseMove = this._onMouseMove.bind(this);
		this._boundOnMouseUp = this._onMouseUp.bind(this);

		if (!this._rootList) {
			return;
		}

		this._registerGroup();
		this.refresh();
		this._bindEvents();
		this._emit("init", {
			payload: this.serialize()
		});
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	_getEventKey(action) {
		switch (action) {
		case "init":
			return EVENT_KEY_INIT;
		case "refresh":
			return EVENT_KEY_REFRESH;
		case "pointerdown":
			return EVENT_KEY_POINTER_DOWN;
		case "start":
			return EVENT_KEY_START;
		case "move":
			return EVENT_KEY_MOVE;
		case "placeholdermove":
			return EVENT_KEY_PLACEHOLDER_MOVE;
		case "drop":
			return EVENT_KEY_DROP;
		case "transfer":
			return EVENT_KEY_TRANSFER;
		case "change":
			return EVENT_KEY_CHANGE;
		case "end":
			return EVENT_KEY_END;
		case "save":
			return EVENT_KEY_SAVE;
		case "destroy":
			return EVENT_KEY_DESTROY;
		default:
			return `${NAME_KEY}.${action}`;
		}
	}

	_emit(action, detail = {}) {
		const payload = {
			action,
			instance: this,
			...detail
		};

		EventHandler.trigger(this._element, this._getEventKey(action), payload);

		const callback = this._params?.callbacks?.[action];
		if (typeof callback === "function") {
			try {
				callback(payload);
			} catch (error) {
				// Keep drag lifecycle stable even if external callback throws.
				console.error(`[${NAME}] callback "${action}" failed`, error);
			}
		}

		return payload;
	}

	_getGroupName() {
		const name = this._params?.group;
		if (name === null || name === undefined) return "";
		return String(name).trim();
	}

	_registerGroup() {
		const group = this._getGroupName();
		if (!group) return;

		if (!VGNestable._groups.has(group)) {
			VGNestable._groups.set(group, new Set());
		}

		VGNestable._groups.get(group).add(this);
	}

	_unregisterGroup() {
		const group = this._getGroupName();
		if (!group || !VGNestable._groups.has(group)) return;

		const set = VGNestable._groups.get(group);
		set.delete(this);
		if (!set.size) {
			VGNestable._groups.delete(group);
		}
	}

	_getConnectedInstances() {
		if (!this._params.connect) return [this];

		const group = this._getGroupName();
		if (!group || !VGNestable._groups.has(group)) return [this];

		return Array.from(VGNestable._groups.get(group)).filter(
			(instance) => instance && instance._rootList
		);
	}

	_findOwnerInstanceByElement(element) {
		if (!element) return null;
		return this._getConnectedInstances().find(
			(instance) => instance._rootList && instance._rootList.contains(element)
		) || null;
	}

	_canAcceptItem(item, sourceInstance) {
		const accept = this._params?.accept;
		if (typeof accept !== "function") return true;
		try {
			return !!accept(item, sourceInstance, this);
		} catch (error) {
			console.error(`[${NAME}] accept() failed`, error);
			return false;
		}
	}

	refresh() {
		this._getItems().forEach((item) => {
			const handle = this._ensureItemLayout(item);

			if (handle) {
				handle.style.cursor = "grab";
				handle.style.userSelect = "none";
			}

			this._syncItemCollapse(item);
		});

		this._emit("refresh", {
			items: this._getItems().length
		});
	}

	_syncItemCollapse(item) {
		if (!item || !this._params.collapse?.enabled) {
			return;
		}

		const inner = this._getDirectChildBySelector(item, `.${CLASS_INNER}`);
		const childList = this._getDirectChildBySelector(item, this._params.listselector);
		let toggle = inner ? this._getDirectChildBySelector(inner, `.${CLASS_COLLAPSE_TOGGLE}`) : null;

		if (!inner || !childList) {
			if (toggle) {
				toggle.remove();
			}
			return;
		}

		if (!childList.id) {
			childList.id = `vg-nestable-collapse-${Math.random().toString(36).slice(2, 10)}`;
		}

		childList.classList.add("vg-collapse");
		if (this._params.collapse.open) {
			childList.classList.add("show");
		} else {
			childList.classList.remove("show");
		}

		if (!toggle) {
			toggle = document.createElement("button");
			toggle.type = "button";
			toggle.className = CLASS_COLLAPSE_TOGGLE;
			inner.insertBefore(toggle, inner.firstChild);
		}

		toggle.setAttribute("data-vg-toggle", "collapse");
		toggle.setAttribute("data-vg-target", `#${childList.id}`);
		toggle.setAttribute("aria-controls", childList.id);
		toggle.setAttribute("data-show-text", this._params.collapse.showtext || getSVG("chevron"));
		toggle.setAttribute("data-hide-text", this._params.collapse.hidetext || getSVG("chevron"));

		const isOpen = childList.classList.contains("show");
		toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
		toggle.innerHTML = isOpen
			? (this._params.collapse.hidetext || getSVG("chevron"))
			: (this._params.collapse.showtext || getSVG("chevron"));

		VGCollapse.getOrCreateInstance(childList, { toggle: false });
	}

	_ensureItemLayout(item) {
		if (!item || !this._params.handleselector) {
			return null;
		}

		const inner = this._ensureInnerLayout(item);
		let handle = this._getDirectChildBySelector(inner, this._params.handleselector);

		if (!handle) {
			const ownHandle = Array.from(item.querySelectorAll(this._params.handleselector)).find(
				(node) => node.closest(this._params.itemselector) === item
			);

			if (ownHandle) {
				handle = ownHandle;
			}
		}

		if (!handle) {
			if (this._params.handleselector !== `.${CLASS_HANDLE}`) {
				return null;
			}

			handle = document.createElement("div");
			handle.classList.add(CLASS_HANDLE);
		}

		if (handle.parentElement !== inner || handle !== inner.firstElementChild) {
			inner.insertBefore(handle, inner.firstChild);
		}

		if (!handle.querySelector(`:scope > .${CLASS_HANDLE_ICON}`)) {
			const icon = document.createElement("span");
			icon.className = CLASS_HANDLE_ICON;
			icon.setAttribute("aria-hidden", "true");
			icon.innerHTML = this._params.handleicon || getSVG('dots-six-vertical') || ":::";
			handle.prepend(icon);
		}

		return handle;
	}

	_ensureInnerLayout(item) {
		let inner = this._getDirectChildBySelector(item, `.${CLASS_INNER}`);
		const childList = this._getDirectChildBySelector(item, this._params.listselector);

		if (!inner) {
			inner = document.createElement("div");
			inner.className = CLASS_INNER;
			item.insertBefore(inner, childList || item.firstChild);
		}

		const nodesToMove = Array.from(item.childNodes).filter((node) => {
			if (node === inner) {
				return false;
			}
			return !(node.nodeType === Node.ELEMENT_NODE && node.matches(this._params.listselector));
		});

		nodesToMove.forEach((node) => inner.append(node));

		if (inner.parentElement !== item) {
			item.insertBefore(inner, childList || item.firstChild);
		}

		return inner;
	}

	_getDirectChildBySelector(parent, selector) {
		if (!parent || !selector) {
			return null;
		}

		return Array.from(parent.children).find((child) => child.matches(selector)) || null;
	}

	serialize() {
		if (!this._rootList) {
			return [];
		}

		return this._serializeList(this._rootList);
	}

	save() {
		const payload = this.serialize();
		const route = this._params.ajax?.route;

		if (!route) {
			this._emit("save", { payload, status: "skipped" });
			return Promise.resolve(payload);
		}

		this._emit("save", { payload, status: "start" });

		return new Promise((resolve, reject) => {
			const prevAjax = this._params.ajax || {};
			const field = this._params.ajax?.field || "items";
			const method = this._params.ajax?.method || "post";

			this._params.ajax = mergeDeepObject(prevAjax, {
				route,
				method,
				once: false,
				output: false,
				data: mergeDeepObject(prevAjax.data || {}, {
					[field]: payload
				})
			});

			this._route((status, response) => {
				this._params.ajax = prevAjax;

				if (status === "success") {
					this._emit("save", {
						payload,
						status: "success",
						response
					});
					resolve(response);
					return;
				}

				const error = response;
				this._emit("save", {
					payload,
					status: "error",
					error
				});
				reject(error);
			});
		});
	}

	dispose() {
		if (this._rootList) {
			this._rootList.removeEventListener("mousedown", this._boundOnMouseDown);
		}

		document.removeEventListener("mousemove", this._boundOnMouseMove);
		document.removeEventListener("mouseup", this._boundOnMouseUp);

		this._clearDragState();
		this._unregisterGroup();
		this._emit("destroy");
		super.dispose();
	}

	_bindEvents() {
		this._rootList.addEventListener("mousedown", this._boundOnMouseDown);
	}

	_resolveRootList() {
		if (!this._element) {
			return null;
		}

		if (this._element.matches(this._params.listselector)) {
			return this._element;
		}

		return this._element.querySelector(this._params.listselector);
	}

	_getItems(scope = this._rootList) {
		if (!scope) {
			return [];
		}

		return Array.from(scope.querySelectorAll(this._params.itemselector));
	}

	_onMouseDown(event) {
		if (event.button !== 0) {
			return;
		}

		const item = event.target.closest(this._params.itemselector);
		if (!item || !this._rootList.contains(item)) {
			return;
		}

		const handleSelector = this._params.handleselector;
		if (handleSelector) {
			const handle = event.target.closest(handleSelector);
			if (!handle || !item.contains(handle)) {
				return;
			}
		}

		event.preventDefault();

		this._draggedItem = item;
		this._mouse.startX = event.clientX;
		this._mouse.startY = event.clientY;
		this._mouse.x = event.clientX;
		this._mouse.y = event.clientY;
		this._isDragging = false;
		this._startSnapshot = "";
		this._emit("pointerdown", {
			item: this._draggedItem,
			mouse: {
				x: this._mouse.x,
				y: this._mouse.y
			}
		});

		document.addEventListener("mousemove", this._boundOnMouseMove);
		document.addEventListener("mouseup", this._boundOnMouseUp);
	}

	_onMouseMove(event) {
		if (!this._draggedItem) {
			return;
		}

		this._mouse.x = event.clientX;
		this._mouse.y = event.clientY;

		if (!this._isDragging) {
			const deltaX = Math.abs(this._mouse.x - this._mouse.startX);
			const deltaY = Math.abs(this._mouse.y - this._mouse.startY);
			if (deltaX < 3 && deltaY < 3) {
				return;
			}
			this._startDrag();
		}

		event.preventDefault();

		this._moveDragElement(this._mouse.x, this._mouse.y);

		const pointerTarget = this._getPointerTarget(this._mouse.x, this._mouse.y);
		if (!pointerTarget) {
			this._setDropListState(null);
			return;
		}

		if (pointerTarget.closest(`.${CLASS_PLACEHOLDER}`)) {
			return;
		}

		const targetInstance = this._findOwnerInstanceByElement(pointerTarget) || this;
		const hoveredItem = pointerTarget.closest(targetInstance._params.itemselector);
		const list = this._resolveDropList(pointerTarget, hoveredItem, targetInstance);
		if (!list || !targetInstance._rootList.contains(list)) {
			this._setDropListState(null);
			return;
		}

		if (!targetInstance._canAcceptItem(this._draggedItem, this._sourceInstance)) {
			this._setDropListState(list, true);
			return;
		}

		const mode = this._resolveMode(this._mouse.x, this._mouse.y, hoveredItem, targetInstance._params);
		this._emit("move", {
			item: this._draggedItem,
			hoveredItem,
			mode,
			targetInstance,
			mouse: {
				x: this._mouse.x,
				y: this._mouse.y
			}
		});
		if (mode === "keep") {
			this._setDropListState(list);
			return;
		}

		if (mode === "child" && hoveredItem) {
			const parentCandidate = targetInstance._getPreviousItem(hoveredItem) || hoveredItem;
			if (!parentCandidate) {
				this._setDropListState(null);
				return;
			}

			if (parentCandidate === this._draggedItem || this._draggedItem.contains(parentCandidate)) {
				this._setDropListState(null);
				return;
			}

			const childList = targetInstance._getOrCreateChildList(parentCandidate);
			if (targetInstance._isDepthExceeded(childList)) {
				this._setDropListState(childList, true);
				return;
			}

			this._placePlaceholder(childList, null);
			this._setDropListState(childList);
			this._currentTargetInstance = targetInstance;
			this._lastDropInstance = targetInstance;
			return;
		}

		if (hoveredItem) {
			if (hoveredItem === this._draggedItem || this._draggedItem.contains(hoveredItem)) {
				this._setDropListState(null);
				return;
			}

			const targetList = hoveredItem.parentElement;
			if (targetInstance._isDepthExceeded(targetList)) {
				this._setDropListState(targetList, true);
				return;
			}

			if (mode === "before") {
				this._placePlaceholder(targetList, hoveredItem);
			} else {
				this._placePlaceholder(targetList, hoveredItem.nextSibling);
			}
			this._setDropListState(targetList);
			this._currentTargetInstance = targetInstance;
			this._lastDropInstance = targetInstance;
			return;
		}

		this._placePlaceholderWhenExplicitlyNeeded(list, this._mouse.y, targetInstance);
		this._setDropListState(list);
		this._currentTargetInstance = targetInstance;
		this._lastDropInstance = targetInstance;
	}

	_onMouseUp() {
		document.removeEventListener("mousemove", this._boundOnMouseMove);
		document.removeEventListener("mouseup", this._boundOnMouseUp);

		if (!this._draggedItem) {
			return;
		}

		const draggedItem = this._draggedItem;
		const hadDrag = this._isDragging;
		const targetInstance = this._lastDropInstance || this;
		const previousPayload = this._startSnapshot ? JSON.parse(this._startSnapshot) : [];
		let sourcePayload = this.serialize();
		let targetPayload = targetInstance.serialize();
		let changed = false;

		if (hadDrag) {
			const placeholderParent = this._placeholder?.parentElement || null;
			if (placeholderParent) {
				placeholderParent.insertBefore(draggedItem, this._placeholder);
			}

			draggedItem.style.display = "";
			this._cleanupEmptyLists();
			if (targetInstance !== this) {
				targetInstance._cleanupEmptyLists();
			}
			this.refresh();
			if (targetInstance !== this) {
				targetInstance.refresh();
			}

			sourcePayload = this.serialize();
			targetPayload = targetInstance.serialize();
			changed = this._startSnapshot !== JSON.stringify(sourcePayload) || targetInstance !== this;
		}

		const payload = sourcePayload;
		this._emit("drop", {
			item: draggedItem,
			payload,
			previousPayload,
			changed,
			targetInstance
		});

		if (changed && targetInstance !== this) {
			this._emit("transfer", {
				item: draggedItem,
				from: this,
				to: targetInstance,
				sourcePayload,
				targetPayload
			});
			targetInstance._emit("transfer", {
				item: draggedItem,
				from: this,
				to: targetInstance,
				sourcePayload,
				targetPayload
			});
			targetInstance._emit("change", { payload: targetPayload, previousPayload: [] });
		}

		this._clearDragState();

		if (changed) {
			this._emit("change", { payload, previousPayload });
		}

		if (hadDrag) {
			this._emit("end", {
				payload,
				changed
			});
		}

		if (changed) {
			if (this._params.ajax?.route) {
				this.save();
			}
			if (targetInstance !== this && targetInstance._params.ajax?.route) {
				targetInstance.save();
			}
		}
	}

	_startDrag() {
		if (!this._draggedItem || this._isDragging) {
			return;
		}

		this._isDragging = true;
		this._startSnapshot = JSON.stringify(this.serialize());
		this._sourceInstance = this;
		this._sourceRoot = this._rootList;
		this._currentTargetInstance = this;
		this._lastDropInstance = this;

		this._placeholder = this._createPlaceholder(this._draggedItem);
		if (!this._params.showplaceholder) {
			this._placeholder.classList.add(CLASS_PLACEHOLDER_HIDDEN);
		}

		this._draggedItem.parentElement.insertBefore(this._placeholder, this._draggedItem.nextSibling);

		this._dragElement = this._createDragElement(this._draggedItem);
		document.body.append(this._dragElement);
		this._moveDragElement(this._mouse.x, this._mouse.y);

		this._draggedItem.classList.add(CLASS_ITEM_DRAGGING);
		this._draggedItem.style.display = "none";
		this._draggedItem.setAttribute("aria-grabbed", "true");

		this._emit("start", {
			item: this._draggedItem,
			payload: this.serialize()
		});
	}

	_createDragElement(item) {
		const rect = item.getBoundingClientRect();
		const dragEl = item.cloneNode(true);

		dragEl.classList.add(CLASS_ITEM_GHOST, CLASS_DRAG_ELEMENT);
		dragEl.style.position = "fixed";
		dragEl.style.left = `${rect.left}px`;
		dragEl.style.top = `${rect.top}px`;
		dragEl.style.width = `${rect.width}px`;
		dragEl.style.zIndex = "99999";
		dragEl.style.pointerEvents = "none";
		dragEl.style.margin = "0";

		return dragEl;
	}

	_moveDragElement(x, y) {
		if (!this._dragElement) {
			return;
		}

		const offsetX = 16;
		const offsetY = 12;
		this._dragElement.style.left = `${x + offsetX}px`;
		this._dragElement.style.top = `${y + offsetY}px`;
	}

	_getPointerTarget(x, y) {
		const el = document.elementFromPoint(x, y);
		if (!el) {
			return null;
		}

		return this._findOwnerInstanceByElement(el) ? el : null;
	}

	_resolveDropList(pointerTarget, hoveredItem, targetInstance = this) {
		if (hoveredItem) {
			return hoveredItem.parentElement;
		}

		const list = pointerTarget.closest(targetInstance._params.listselector);
		if (list && targetInstance._rootList.contains(list)) {
			return list;
		}

		return targetInstance._rootList;
	}

_resolveMode(pointerX, pointerY, hoveredItem, params = this._params) {
	if (!hoveredItem) {
		return "append";
	}

	const rect = hoveredItem.getBoundingClientRect();
	const offsetY = pointerY - rect.top;
	const offsetX = pointerX - this._mouse.startX;
	const neighborThresholdPercent = Math.max(
		0,
		Math.min(49, Number(params.neighborchangethreshold || 0))
	);

	if (neighborThresholdPercent > 0) {
		const edgeRatio = neighborThresholdPercent / 100;
		const topBorder = rect.height * edgeRatio;
		const bottomBorder = rect.height * (1 - edgeRatio);

		if (offsetX > params.indent) {
			return "child";
		}

		if (offsetY <= topBorder) {
			return "before";
		}

		if (offsetY >= bottomBorder) {
			return "after";
		}

		return "keep";
	}

	const threshold = Math.min(
		0.45,
		Math.max(0.05, Number(params.hoverthreshold || 0.18))
	);

	if (offsetX > params.indent) {
		return "child";
	}

	if (offsetY < rect.height * (0.5 - threshold)) {
		return "before";
	}

	if (offsetY > rect.height * (0.5 + threshold)) {
		return "after";
	}

	return "keep";
}

	_getPreviousItem(item) {
		let sibling = item?.previousElementSibling || null;
		while (sibling && !sibling.matches(this._params.itemselector)) {
			sibling = sibling.previousElementSibling;
		}
		return sibling;
	}

	_getOrCreateChildList(item) {
		let list = item.querySelector(`:scope > ${this._params.listselector}`);
		if (list) {
			return list;
		}

		list = document.createElement(this._rootList.tagName || "ol");

		if (this._params.childlistclass) {
			this._params.childlistclass
				.split(" ")
				.filter(Boolean)
				.forEach((className) => list.classList.add(className));
		}

		item.append(list);
		return list;
	}

	_isDepthExceeded(list) {
		const listDepth = this._getListDepth(list);
		return listDepth > Number(this._params.maxdepth || 1);
	}

	_getListDepth(list) {
		if (!list) {
			return 1;
		}

		let depth = 1;
		let currentList = list;

		while (currentList && currentList !== this._rootList) {
			const parentItem = currentList.closest(this._params.itemselector);
			if (!parentItem) {
				break;
			}
			depth += 1;
			currentList = parentItem.parentElement?.closest(this._params.listselector);
		}

		return depth;
	}

	_cleanupEmptyLists() {
		if (!this._rootList) {
			return;
		}

		const lists = Array.from(this._rootList.querySelectorAll(this._params.listselector));
		lists.forEach((list) => {
			if (list === this._rootList) {
				return;
			}

			const hasItems = Array.from(list.children).some((child) => child.matches(this._params.itemselector));
			if (!hasItems) {
				list.remove();
			}
		});
	}

	_createPlaceholder(item) {
		const tag = item.tagName && item.tagName.toLowerCase() === "li" ? "li" : "div";
		const placeholder = document.createElement(tag);
		placeholder.className = CLASS_PLACEHOLDER;
		placeholder.style.height = `${Math.max(item.getBoundingClientRect().height, 24)}px`;
		placeholder.setAttribute("aria-hidden", "true");
		return placeholder;
	}

	_placePlaceholder(parent, beforeNode = null) {
		if (!parent || !this._placeholder) {
			return;
		}

		if (beforeNode === this._placeholder) {
			return;
		}

		const currentParent = this._placeholder.parentElement;
		const currentNext = this._placeholder.nextSibling;

		if (currentParent === parent && currentNext === beforeNode) {
			return;
		}

		parent.insertBefore(this._placeholder, beforeNode);
		this._emit("placeholdermove", {
			parent,
			beforeNode,
			item: this._draggedItem
		});
	}

	_placePlaceholderWhenExplicitlyNeeded(list, pointerY, targetInstance = this) {
		if (!list || targetInstance._isDepthExceeded(list)) {
			return;
		}

		const items = Array.from(list.children).filter((child) => child.matches(this._params.itemselector));
		if (!items.length) {
			this._placePlaceholder(list, null);
			return;
		}

		const edgeThreshold = 8;
		const firstItem = items[0];
		const lastItem = items[items.length - 1];
		const firstRect = firstItem.getBoundingClientRect();
		const lastRect = lastItem.getBoundingClientRect();

		if (pointerY <= firstRect.top + edgeThreshold) {
			this._placePlaceholder(list, firstItem);
			return;
		}

		if (pointerY >= lastRect.bottom - edgeThreshold) {
			this._placePlaceholder(list, null);
		}
	}

	_setDropListState(list, denied = false) {
		if (this._activeDropList && this._activeDropList !== list) {
			this._activeDropList.classList.remove(CLASS_DROP_TARGET, CLASS_DROP_DENIED);
		}

		if (!list) {
			this._activeDropList = null;
			return;
		}

		list.classList.add(denied ? CLASS_DROP_DENIED : CLASS_DROP_TARGET);
		list.classList.remove(denied ? CLASS_DROP_TARGET : CLASS_DROP_DENIED);
		this._activeDropList = list;
	}

	_clearDragState() {
		this._setDropListState(null);

		if (this._draggedItem) {
			this._draggedItem.classList.remove(CLASS_ITEM_DRAGGING);
			this._draggedItem.style.display = "";
			this._draggedItem.removeAttribute("aria-grabbed");
		}

		if (this._dragElement && this._dragElement.parentElement) {
			this._dragElement.remove();
		}

		if (this._placeholder && this._placeholder.parentElement) {
			this._placeholder.remove();
		}

		this._draggedItem = null;
		this._placeholder = null;
		this._dragElement = null;
		this._isDragging = false;
		this._currentTargetInstance = this;
		this._lastDropInstance = this;
	}

	_serializeList(list) {
		const items = Array.from(list.children).filter((child) => child.matches(this._params.itemselector));

		return items.map((item) => {
			const id = normalizeData(item.getAttribute(this._params.idattribute));
			const childList = item.querySelector(`:scope > ${this._params.listselector}`);

			const data = { id: id ?? null };

			if (childList) {
				const children = this._serializeList(childList);
				if (children.length) {
					data.children = children;
				}
			}

			return data;
		});
	}
}

EventHandler.on(document, `DOMContentLoaded.${NAME_KEY}.data.api`, () => {
	Selectors.findAll(SELECTOR_DATA_TOGGLE).forEach((el) => VGNestable.getOrCreateInstance(el));
});

export default VGNestable;






