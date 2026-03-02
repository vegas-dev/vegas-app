import BaseModule from "../../base-module";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import { mergeDeepObject, normalizeData } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {getSVG} from "../../module-fn";
import Ajax from "../../../utils/js/components/ajax";
import Sanitize from "../../../utils/js/components/sanitize";

const NAME = "nestable";
const NAME_KEY = "vg.nestable";

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="nestable"]';

const CLASS_ITEM_DRAGGING = "is-dragging";
const CLASS_ITEM_GHOST = "is-drag-ghost";
const CLASS_PLACEHOLDER = "vg-nestable-placeholder";
const CLASS_PLACEHOLDER_HIDDEN = "vg-nestable-placeholder-hidden";
const CLASS_DRAG_ELEMENT = "vg-nestable-drag-element";
const CLASS_DRAG_LAYER = "vg-nestable-drag-layer";
const CLASS_INNER = "vg-nestable-inner";
const CLASS_HANDLE = "vg-nestable-handle";
const CLASS_HANDLE_ICON = "vg-nestable-handle-icon";
const CLASS_COLLAPSE_TOGGLE = "vg-nestable-collapse-toggle";
const CLASS_DROP_TARGET = "is-drop-target";
const CLASS_DROP_DENIED = "is-drop-denied";
const CLASS_LIVE_REGION = "vg-nestable-live";

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
			indent: 50, // X offset (px), after which item moves into child level.
			maxdepth: 6, // Maximum nesting depth.
			moveaxis: "default", // Drag direction: default | vertical | horizontal.
			hoverthreshold: 0, // Vertical threshold (0..0.5) around hovered item center.
			neighborchangethreshold: 0, // Percentage (0..49) of entering adjacent item before position changes.
			showplaceholder: true, // Show placeholder during drag.
			group: "",
			connect: false,
			accept: null,
			collapse: {
				enabled: true,
				open: true,
				showtext: getSVG("plus"),
				hidetext: getSVG("minus")
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
		this._dragLayer = null;
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
			startItemX: 0,
			grabOffsetX: 0,
			grabOffsetY: 0,
			x: 0,
			y: 0
		};

		this._previousBodyCursor = "";

		this._boundOnMouseDown = this._onMouseDown.bind(this);
		this._boundOnMouseMove = this._onMouseMove.bind(this);
		this._boundOnMouseUp = this._onMouseUp.bind(this);
		this._boundOnPointerDown = this._onPointerDown.bind(this);
		this._boundOnPointerMove = this._onPointerMove.bind(this);
		this._boundOnPointerUp = this._onPointerUp.bind(this);
		this._boundOnPointerCancel = this._onPointerCancel.bind(this);
		this._boundOnTouchStart = this._onTouchStart.bind(this);
		this._boundOnTouchMove = this._onTouchMove.bind(this);
		this._boundOnTouchEnd = this._onTouchEnd.bind(this);
		this._boundOnTouchCancel = this._onTouchCancel.bind(this);
		this._boundOnKeyDown = this._onKeyDown.bind(this);
		this._supportsPointerEvents = typeof window !== "undefined" && "PointerEvent" in window;
		this._activePointerId = null;
		this._activeTouchId = null;
		this._keyboardDraggedItem = null;
		this._keyboardStartSnapshot = "";
		this._liveRegion = null;

		if (!this._rootList) {
			return;
		}

		this._registerGroup();
		this.refresh();
		this._ensureLiveRegion();
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
				handle.style.touchAction = "none";

				if (!["BUTTON", "A", "INPUT"].includes(handle.tagName)) {
					handle.setAttribute("role", "button");
				}
				if (!handle.hasAttribute("tabindex")) {
					handle.setAttribute("tabindex", "0");
				}
				if (!handle.hasAttribute("aria-label")) {
					handle.setAttribute("aria-label", "Drag item");
				}
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
		const handle = inner ? this._getDirectChildBySelector(inner, `.${CLASS_HANDLE}`) : null;
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
			if (handle) {
				inner.insertBefore(toggle, handle.nextSibling);
			} else {
				inner.insertBefore(toggle, inner.firstChild);
			}
		} else if (handle && toggle.previousElementSibling !== handle) {
			inner.insertBefore(toggle, handle.nextSibling);
		}

		toggle.setAttribute("data-vg-toggle", "collapse");
		toggle.setAttribute("data-vg-target", `#${childList.id}`);
		toggle.setAttribute("aria-controls", childList.id);
		const safeShowText = Sanitize.toSafeHtmlString(this._params.collapse.showtext || getSVG("chevron"));
		const safeHideText = Sanitize.toSafeHtmlString(this._params.collapse.hidetext || getSVG("chevron"));
		toggle.setAttribute("data-show-text", safeShowText);
		toggle.setAttribute("data-hide-text", safeHideText);

		const isOpen = childList.classList.contains("show");
		toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
		toggle.innerHTML = isOpen ? safeHideText : safeShowText;

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
			icon.innerHTML = Sanitize.toSafeHtmlString(this._params.handleicon || getSVG("dots-six-vertical") || ":::");
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
			const ajaxParams = this._params.ajax || {};
			const field = ajaxParams.field || "items";
			const method = String(ajaxParams.method || "post").toLowerCase();
			const timeout = Number(ajaxParams.timeout || 0);
			const data = mergeDeepObject(ajaxParams.data || {}, {
				[field]: payload
			});
			const ajax = new Ajax();
			const callbacks = {
				onSuccess: (response) => {
					this._emit("save", {
						payload,
						status: "success",
						response
					});
					resolve(response);
				},
				onError: (error) => {
					this._emit("save", {
						payload,
						status: "error",
						error
					});
					reject(error);
				}
			};

			setTimeout(() => {
				switch (method) {
				case "get":
					ajax.get(route, callbacks);
					break;
				case "delete":
					ajax.delete(route, callbacks);
					break;
				default:
					ajax.post(route, data, callbacks);
					break;
				}
			}, timeout);
		});
	}

	dispose() {
		if (this._rootList) {
			if (this._supportsPointerEvents) {
				this._rootList.removeEventListener("pointerdown", this._boundOnPointerDown);
			} else {
				this._rootList.removeEventListener("mousedown", this._boundOnMouseDown);
				this._rootList.removeEventListener("touchstart", this._boundOnTouchStart);
			}
			this._rootList.removeEventListener("keydown", this._boundOnKeyDown);
		}

		document.removeEventListener("mousemove", this._boundOnMouseMove);
		document.removeEventListener("mouseup", this._boundOnMouseUp);
		document.removeEventListener("pointermove", this._boundOnPointerMove);
		document.removeEventListener("pointerup", this._boundOnPointerUp);
		document.removeEventListener("pointercancel", this._boundOnPointerCancel);
		document.removeEventListener("touchmove", this._boundOnTouchMove);
		document.removeEventListener("touchend", this._boundOnTouchEnd);
		document.removeEventListener("touchcancel", this._boundOnTouchCancel);

		this._clearDragState();
		this._clearKeyboardDragState();
		if (this._liveRegion?.parentElement) {
			this._liveRegion.remove();
		}
		this._liveRegion = null;
		this._unregisterGroup();
		this._emit("destroy");
		super.dispose();
	}

	_bindEvents() {
		this._rootList.addEventListener("keydown", this._boundOnKeyDown);

		if (this._supportsPointerEvents) {
			this._rootList.addEventListener("pointerdown", this._boundOnPointerDown);
			return;
		}

		this._rootList.addEventListener("mousedown", this._boundOnMouseDown);
		this._rootList.addEventListener("touchstart", this._boundOnTouchStart, { passive: false });
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

		this._startInteraction(event.target, event.clientX, event.clientY, event);
		if (!this._draggedItem) {
			return;
		}

		document.addEventListener("mousemove", this._boundOnMouseMove);
		document.addEventListener("mouseup", this._boundOnMouseUp);
	}

	_onMouseMove(event) {
		this._processDragMove(event.clientX, event.clientY, event);
	}

	_onMouseUp() {
		document.removeEventListener("mousemove", this._boundOnMouseMove);
		document.removeEventListener("mouseup", this._boundOnMouseUp);
		this._finishDrag();
	}

	_onPointerDown(event) {
		if (event.pointerType === "mouse" && event.button !== 0) {
			return;
		}

		this._startInteraction(event.target, event.clientX, event.clientY, event);
		if (!this._draggedItem) {
			return;
		}

		this._activePointerId = event.pointerId;
		document.addEventListener("pointermove", this._boundOnPointerMove);
		document.addEventListener("pointerup", this._boundOnPointerUp);
		document.addEventListener("pointercancel", this._boundOnPointerCancel);
	}

	_onPointerMove(event) {
		if (!this._draggedItem || event.pointerId !== this._activePointerId) {
			return;
		}

		this._processDragMove(event.clientX, event.clientY, event);
	}

	_onPointerUp(event) {
		if (event.pointerId !== this._activePointerId) {
			return;
		}

		this._activePointerId = null;
		document.removeEventListener("pointermove", this._boundOnPointerMove);
		document.removeEventListener("pointerup", this._boundOnPointerUp);
		document.removeEventListener("pointercancel", this._boundOnPointerCancel);
		this._finishDrag();
	}

	_onPointerCancel(event) {
		if (event.pointerId !== this._activePointerId) {
			return;
		}

		this._activePointerId = null;
		document.removeEventListener("pointermove", this._boundOnPointerMove);
		document.removeEventListener("pointerup", this._boundOnPointerUp);
		document.removeEventListener("pointercancel", this._boundOnPointerCancel);
		this._cancelDrag();
	}

	_onTouchStart(event) {
		if (this._activeTouchId !== null || !event.changedTouches?.length) {
			return;
		}

		const touch = event.changedTouches[0];
		this._startInteraction(touch.target, touch.clientX, touch.clientY, event);
		if (!this._draggedItem) {
			return;
		}

		this._activeTouchId = touch.identifier;
		document.addEventListener("touchmove", this._boundOnTouchMove, { passive: false });
		document.addEventListener("touchend", this._boundOnTouchEnd);
		document.addEventListener("touchcancel", this._boundOnTouchCancel);
	}

	_onTouchMove(event) {
		if (!this._draggedItem || this._activeTouchId === null) {
			return;
		}

		const touch = this._findTouchById(event.changedTouches, this._activeTouchId)
			|| this._findTouchById(event.touches, this._activeTouchId);
		if (!touch) {
			return;
		}

		this._processDragMove(touch.clientX, touch.clientY, event);
	}

	_onTouchEnd(event) {
		if (this._activeTouchId === null) {
			return;
		}

		const touch = this._findTouchById(event.changedTouches, this._activeTouchId);
		if (!touch) {
			return;
		}

		this._activeTouchId = null;
		document.removeEventListener("touchmove", this._boundOnTouchMove);
		document.removeEventListener("touchend", this._boundOnTouchEnd);
		document.removeEventListener("touchcancel", this._boundOnTouchCancel);
		this._finishDrag();
	}

	_onTouchCancel() {
		if (this._activeTouchId === null) {
			return;
		}

		this._activeTouchId = null;
		document.removeEventListener("touchmove", this._boundOnTouchMove);
		document.removeEventListener("touchend", this._boundOnTouchEnd);
		document.removeEventListener("touchcancel", this._boundOnTouchCancel);
		this._cancelDrag();
	}

	_onKeyDown(event) {
		if (this._isDragging || this._draggedItem) {
			return;
		}

		const item = event.target?.closest?.(this._params.itemselector);
		if (!item || !this._rootList.contains(item)) {
			return;
		}

		const key = event.key;
		const isToggleKey = key === " " || key === "Enter";

		if (isToggleKey && !this._keyboardDraggedItem) {
			if (!this._isKeyboardDragHandle(event.target, item)) {
				return;
			}

			event.preventDefault();
			this._startKeyboardDrag(item);
			return;
		}

		if (!this._keyboardDraggedItem) {
			return;
		}

		if (item !== this._keyboardDraggedItem && !this._keyboardDraggedItem.contains(item)) {
			return;
		}

		if (isToggleKey) {
			event.preventDefault();
			this._finishKeyboardDrag();
			return;
		}

		if (key === "Escape") {
			event.preventDefault();
			this._finishKeyboardDrag({ cancelled: true });
			return;
		}

		let moved = false;
		let moveAnnouncement = "";
		const moveAxis = this._getMoveAxis();
		const allowVertical = moveAxis !== "horizontal";
		const allowHorizontal = moveAxis !== "vertical";

		if (key === "ArrowUp") {
			if (!allowVertical) {
				return;
			}
			event.preventDefault();
			moved = this._moveKeyboardUp(this._keyboardDraggedItem);
			moveAnnouncement = "Moved up.";
		} else if (key === "ArrowDown") {
			if (!allowVertical) {
				return;
			}
			event.preventDefault();
			moved = this._moveKeyboardDown(this._keyboardDraggedItem);
			moveAnnouncement = "Moved down.";
		} else if (key === "ArrowRight") {
			if (!allowHorizontal) {
				return;
			}
			event.preventDefault();
			moved = this._indentKeyboard(this._keyboardDraggedItem);
			moveAnnouncement = "Nested into previous item.";
		} else if (key === "ArrowLeft") {
			if (!allowHorizontal) {
				return;
			}
			event.preventDefault();
			moved = this._outdentKeyboard(this._keyboardDraggedItem);
			moveAnnouncement = "Moved out one level.";
		}

		if (!moved) {
			return;
		}

		this._cleanupEmptyLists();
		this.refresh();
		this._keyboardDraggedItem.focus?.();
		this._emit("move", {
			item: this._keyboardDraggedItem,
			targetInstance: this,
			keyboard: true,
			mouse: null
		});
		if (moveAnnouncement) {
			this._announce(moveAnnouncement);
		}
	}

	_isKeyboardDragHandle(target, item) {
		if (!target || !item) {
			return false;
		}

		const handleSelector = this._params.handleselector;
		if (!handleSelector) {
			return true;
		}

		const handle = target.closest(handleSelector);
		return !!(handle && item.contains(handle));
	}

	_startKeyboardDrag(item) {
		if (!item || this._keyboardDraggedItem) {
			return;
		}

		this._keyboardDraggedItem = item;
		this._keyboardStartSnapshot = JSON.stringify(this.serialize());
		item.classList.add(CLASS_ITEM_DRAGGING);
		item.setAttribute("aria-grabbed", "true");

		this._emit("start", {
			item,
			payload: this.serialize(),
			keyboard: true
		});
		this._announce(this._getKeyboardDragInstructions());
	}

	_finishKeyboardDrag(options = {}) {
		if (!this._keyboardDraggedItem) {
			return;
		}

		const draggedItem = this._keyboardDraggedItem;
		const previousPayload = this._keyboardStartSnapshot ? JSON.parse(this._keyboardStartSnapshot) : [];
		const payload = this.serialize();
		const changed = this._keyboardStartSnapshot !== JSON.stringify(payload);

		this._emit("drop", {
			item: draggedItem,
			payload,
			previousPayload,
			changed,
			targetInstance: this,
			keyboard: true,
			cancelled: !!options.cancelled
		});

		if (changed) {
			this._emit("change", { payload, previousPayload, keyboard: true });
		}

		this._emit("end", {
			payload,
			changed,
			keyboard: true,
			cancelled: !!options.cancelled
		});
		if (options.cancelled) {
			this._announce("Move cancelled.");
		} else if (changed) {
			this._announce("Item dropped.");
		} else {
			this._announce("Item position unchanged.");
		}

		if (changed && this._params.ajax?.route) {
			this.save();
		}

		this._clearKeyboardDragState();
	}

	_clearKeyboardDragState() {
		if (this._keyboardDraggedItem) {
			this._keyboardDraggedItem.classList.remove(CLASS_ITEM_DRAGGING);
			this._keyboardDraggedItem.removeAttribute("aria-grabbed");
		}

		this._keyboardDraggedItem = null;
		this._keyboardStartSnapshot = "";
	}

	_moveKeyboardUp(item) {
		const prev = this._getPreviousItem(item);
		if (!prev) {
			this._announce("Cannot move up.");
			return false;
		}

		const list = item.parentElement;
		list.insertBefore(item, prev);
		return true;
	}

	_moveKeyboardDown(item) {
		const next = this._getNextItem(item);
		if (!next) {
			this._announce("Cannot move down.");
			return false;
		}

		const list = item.parentElement;
		list.insertBefore(item, next.nextSibling);
		return true;
	}

	_indentKeyboard(item) {
		const parentCandidate = this._getPreviousItem(item);
		if (!parentCandidate || parentCandidate === item || item.contains(parentCandidate)) {
			this._announce("Cannot nest here.");
			return false;
		}

		const childList = this._getOrCreateChildList(parentCandidate);
		if (this._isDepthExceeded(childList, item)) {
			this._announce("Maximum nesting depth reached.");
			return false;
		}

		childList.append(item);
		return true;
	}

	_outdentKeyboard(item) {
		const currentList = item.parentElement;
		const parentItem = currentList?.closest(this._params.itemselector);
		if (!parentItem) {
			this._announce("Cannot move left.");
			return false;
		}

		const targetList = parentItem.parentElement;
		if (!targetList) {
			this._announce("Cannot move left.");
			return false;
		}

		targetList.insertBefore(item, parentItem.nextSibling);
		return true;
	}

	_getMoveAxis(params = this._params) {
		const rawAxis = String(params?.moveaxis || "default").trim().toLowerCase();
		if (rawAxis === "vertical" || rawAxis === "horizontal") {
			return rawAxis;
		}
		return "default";
	}

	_getKeyboardDragInstructions() {
		const moveAxis = this._getMoveAxis();
		if (moveAxis === "vertical") {
			return "Picked up item. Use Up/Down arrows to move, Enter or Space to drop, Escape to cancel.";
		}
		if (moveAxis === "horizontal") {
			return "Picked up item. Use Left/Right arrows to move, Enter or Space to drop, Escape to cancel.";
		}
		return "Picked up item. Use arrow keys to move, Enter or Space to drop, Escape to cancel.";
	}

	_startInteraction(target, clientX, clientY, event) {
		if (this._keyboardDraggedItem) {
			this._clearKeyboardDragState();
		}

		const item = target?.closest?.(this._params.itemselector);
		if (!item || !this._rootList.contains(item)) {
			return;
		}

		const handleSelector = this._params.handleselector;
		if (handleSelector) {
			const handle = target.closest(handleSelector);
			if (!handle || !item.contains(handle)) {
				return;
			}
		}

		event.preventDefault();

		const itemRect = item.getBoundingClientRect();
		this._draggedItem = item;
		this._mouse.startX = clientX;
		this._mouse.startY = clientY;
		this._mouse.startItemX = itemRect.left;
		this._mouse.grabOffsetX = clientX - itemRect.left;
		this._mouse.grabOffsetY = clientY - itemRect.top;
		this._mouse.x = clientX;
		this._mouse.y = clientY;
		this._isDragging = false;
		this._startSnapshot = "";
		this._emit("pointerdown", {
			item: this._draggedItem,
			mouse: {
				x: this._mouse.x,
				y: this._mouse.y
			}
		});
	}

	_processDragMove(clientX, clientY, event) {
		if (!this._draggedItem) {
			return;
		}

		this._mouse.x = clientX;
		this._mouse.y = clientY;

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

		if (mode === "child") {
			// Indent: make dragged item a child of the hovered item (when available).
			// This lets the user "shift right" without needing an extra vertical nudge first.
			let parentCandidate = null;

			if (hoveredItem) {
				if (hoveredItem === this._draggedItem || this._draggedItem.contains(hoveredItem)) {
					this._setDropListState(null);
					return;
				}
				parentCandidate = hoveredItem;
			} else {
				this._placePlaceholderWhenExplicitlyNeeded(list, this._mouse.y, targetInstance);
				const placeholderParent = this._placeholder?.parentElement || null;
				if (placeholderParent) {
					parentCandidate = targetInstance._getPreviousItem(this._placeholder);
					while (parentCandidate && (parentCandidate === this._draggedItem || this._draggedItem.contains(parentCandidate))) {
						parentCandidate = targetInstance._getPreviousItem(parentCandidate);
					}
				}
			}

			if (!parentCandidate) {
				this._setDropListState(null);
				return;
			}

			const childList = targetInstance._getOrCreateChildList(parentCandidate);
			if (targetInstance._isDepthExceeded(childList, this._draggedItem)) {
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
			if (targetInstance._isDepthExceeded(targetList, this._draggedItem)) {
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

	_finishDrag() {
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

	_cancelDrag() {
		if (!this._draggedItem) {
			return;
		}

		const hadDrag = this._isDragging;
		this._clearDragState();

		if (hadDrag) {
			this._emit("end", {
				payload: this.serialize(),
				changed: false,
				cancelled: true
			});
		}
	}

	_findTouchById(touchList, id) {
		if (!touchList || id === null || id === undefined) {
			return null;
		}

		for (let index = 0; index < touchList.length; index += 1) {
			if (touchList[index].identifier === id) {
				return touchList[index];
			}
		}

		return null;
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
		this._dragLayer = document.createElement("div");
		this._dragLayer.classList.add(CLASS_DRAG_LAYER);
		// Keep scoped styles working for the drag preview (e.g. ".vg-nestable .vg-nestable-item ...").
		if (this._element?.classList) {
			this._element.classList.forEach((className) => this._dragLayer.classList.add(className));
		}
		this._dragLayer.style.position = "fixed";
		this._dragLayer.style.left = "0";
		this._dragLayer.style.top = "0";
		this._dragLayer.style.width = "0";
		this._dragLayer.style.height = "0";
		this._dragLayer.style.pointerEvents = "none";
		this._dragLayer.style.zIndex = "99999";
		document.body.append(this._dragLayer);
		this._dragLayer.append(this._dragElement);

		if (typeof document !== "undefined" && document.body) {
			this._previousBodyCursor = document.body.style.cursor || "";
			document.body.style.cursor = "grabbing";
		}

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

		// Keep the cursor at the same relative point where the user grabbed the item.
		const left = x - (Number(this._mouse.grabOffsetX) || 0);
		const top = y - (Number(this._mouse.grabOffsetY) || 0);
		this._dragElement.style.left = `${left}px`;
		this._dragElement.style.top = `${top}px`;
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
	// Use the dragged item's original left edge as baseline, not the pointer-down X.
	// This makes "shift right to nest" work reliably regardless of where inside the handle the user grabbed.
	const baseX = Number.isFinite(this._mouse.startItemX) ? this._mouse.startItemX : this._mouse.startX;
	const offsetX = pointerX - baseX;
	const indentValue = parseFloat(params.indent);
	const indent = Number.isFinite(indentValue) ? indentValue : 0;
	const moveAxis = this._getMoveAxis(params);
	const allowVertical = moveAxis !== "horizontal";
	const allowHorizontal = moveAxis !== "vertical";
	const neighborThresholdPercent = Math.max(
		0,
		Math.min(49, Number(params.neighborchangethreshold || 0))
	);

	if (neighborThresholdPercent > 0) {
		const edgeRatio = neighborThresholdPercent / 100;
		const topBorder = rect.height * edgeRatio;
		const bottomBorder = rect.height * (1 - edgeRatio);

		if (allowHorizontal && offsetX > indent) {
			return "child";
		}

		if (allowVertical && offsetY <= topBorder) {
			return "before";
		}

		if (allowVertical && offsetY >= bottomBorder) {
			return "after";
		}

		return "keep";
	}

	const threshold = Math.min(
		0.45,
		Math.max(0.05, Number(params.hoverthreshold || 0.18))
	);

	if (allowHorizontal && offsetX > indent) {
		return "child";
	}

	if (allowVertical && offsetY < rect.height * (0.5 - threshold)) {
		return "before";
	}

	if (allowVertical && offsetY > rect.height * (0.5 + threshold)) {
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

	_getNextItem(item) {
		let sibling = item?.nextElementSibling || null;
		while (sibling && !sibling.matches(this._params.itemselector)) {
			sibling = sibling.nextElementSibling;
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

	_isDepthExceeded(list, draggedItem = this._draggedItem) {
		const listDepth = this._getListDepth(list);
		const maxDepth = Number(this._params.maxdepth || 1);
		const subtreeDepth = this._getItemSubtreeDepth(draggedItem);
		return (listDepth + subtreeDepth - 1) > maxDepth;
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

	_getItemSubtreeDepth(item) {
		if (!item) {
			return 1;
		}

		const childList = this._getDirectChildBySelector(item, this._params.listselector);
		if (!childList) {
			return 1;
		}

		const childItems = Array.from(childList.children).filter((child) => child.matches(this._params.itemselector));
		if (!childItems.length) {
			return 1;
		}

		const maxChildDepth = childItems.reduce(
			(depth, childItem) => Math.max(depth, this._getItemSubtreeDepth(childItem)),
			1
		);

		return maxChildDepth + 1;
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
		if (!list || targetInstance._isDepthExceeded(list, this._draggedItem)) {
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

		if (this._dragLayer && this._dragLayer.parentElement) {
			this._dragLayer.remove();
		}

		if (typeof document !== "undefined" && document.body) {
			document.body.style.cursor = this._previousBodyCursor || "";
		}

		if (this._placeholder && this._placeholder.parentElement) {
			this._placeholder.remove();
		}

		this._draggedItem = null;
		this._placeholder = null;
		this._dragElement = null;
		this._dragLayer = null;
		this._previousBodyCursor = "";
		this._isDragging = false;
		this._currentTargetInstance = this;
		this._lastDropInstance = this;
		this._activePointerId = null;
		this._activeTouchId = null;
	}

	_ensureLiveRegion() {
		if (!this._element || this._liveRegion) {
			return;
		}

		const live = document.createElement("div");
		live.className = CLASS_LIVE_REGION;
		live.setAttribute("aria-live", "polite");
		live.setAttribute("aria-atomic", "true");
		live.style.position = "absolute";
		live.style.width = "1px";
		live.style.height = "1px";
		live.style.margin = "-1px";
		live.style.border = "0";
		live.style.padding = "0";
		live.style.clip = "rect(0 0 0 0)";
		live.style.clipPath = "inset(50%)";
		live.style.overflow = "hidden";
		live.style.whiteSpace = "nowrap";
		this._element.append(live);
		this._liveRegion = live;
	}

	_announce(message) {
		if (!message) {
			return;
		}

		this._ensureLiveRegion();
		if (!this._liveRegion) {
			return;
		}

		this._liveRegion.textContent = "";
		requestAnimationFrame(() => {
			if (this._liveRegion) {
				this._liveRegion.textContent = message;
			}
		});
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






