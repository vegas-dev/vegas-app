/**
 * Описание: Управляет локальными и smartdrop-событиями файловых dropzone VGFiles.
 * Возможности: Отличает внешнее добавление файлов от внутренней сортировки, подсвечивает активную зону и передаёт файлы input-элементу.
 */
import { isElement } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { Classes } from "../../../utils/js/dom/manipulator";
import BaseModule from "../../base-module";
import {isVGFilesSortableDragActive, VG_FILES_SORTABLE_DATA_TYPE} from "./sortable";

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_DROP = `${CLASS_NAME_CONTAINER}-drop`;
const CLASS_NAME_DROP_LIST = `${CLASS_NAME_DROP}--list`;

const CLASS_NAME_DROP_ACTIVE = 'drop-active';
const CLASS_NAME_DROP_HOVER = 'drop-hover';

const NAME = 'drop-and-drop';
const NAME_KEY = 'vg.drop-and-drop';

class VGFilesDroppable extends BaseModule {
    /**
     * @param {HTMLElement} element
     * @param {Object} params
     */
    constructor(element, params = {}) {
        super(element, params);
        this._element = element;
        this._params = params;

        this._files = null;
        this._input = null;
        this._init();
    }

    static get NAME() { return NAME; }
    static get NAME_KEY() { return NAME_KEY; }

    _init() {
        VGFilesDroppable._instances.add(this);
        if (this._params?.smartdrop) {
            VGFilesDroppable._smartInstances.add(this);
            this._bindGlobalEvents();
        }
        this._findInput();
        this._setupEvents();
    }

    /**
     * Поиск связанного input[type="file"] внутри или рядом с drop-зоной
     */
    _findInput() {
        const { id, name } = this._element.dataset;
        if (id) this._input = document.getElementById(id);
        if (!this._input && name) {
            this._input = Selectors.find(`[name="${name}"]`);
        }
        if (!this._input) {
            this._input = Selectors.find('input[type="file"]', this._element) || Selectors.find('input[type="file"]', this._element.parentNode);
        }
    }

    /**
     * Настройка событий перетаскивания
     */
    _setupEvents() {
        if (!isElement(this._element)) return;

        EventHandler.on(this._element, `click.${NAME_KEY}`, (e) => {
            if (this._element.tagName !== 'LABEL') return;

            const fileList = e.target?.closest?.(`.${CLASS_NAME_DROP_LIST}`);
            if (fileList && this._element.contains(fileList)) {
                e.preventDefault();
            }
        });

        EventHandler.on(this._element, 'dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // ✅ Сортировка: НЕ подсвечиваем dropzone
            if (this._isSortableDrag(e)) {
                Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
                VGFilesDroppable._setDropMessageTitleState(this._element, false);
                e.dataTransfer.dropEffect = 'none';
                return;
            }

            if (!Classes.has(this._element, CLASS_NAME_DROP_ACTIVE)) {
                Classes.add(this._element, CLASS_NAME_DROP_HOVER);
            }
        });

        EventHandler.on(this._element, 'dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // ✅ Сортировка: НЕ подсвечиваем dropzone
            if (this._isSortableDrag(e)) {
                Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
                VGFilesDroppable._setDropMessageTitleState(this._element, false);
                return;
            }

            Classes.add(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
            VGFilesDroppable._setDropMessageTitleState(this._element, true);
        });

        EventHandler.on(this._element, 'dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // ✅ Сортировка: гарантированно без подсветки
            if (this._isSortableDrag(e)) {
                Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
                VGFilesDroppable._setDropMessageTitleState(this._element, false);
                return;
            }

            if (e.target === this._element || e.target.closest('.' + CLASS_NAME_DROP) === this._element) {
                Classes.remove(this._element, CLASS_NAME_DROP_HOVER);
                setTimeout(() => {
                    if (!this._element.matches(':hover')) {
                        Classes.remove(this._element, CLASS_NAME_DROP_ACTIVE);
                        VGFilesDroppable._setDropMessageTitleState(this._element, false);
                    }
                }, 50);
            }
        });

        EventHandler.on(this._element, 'drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
            VGFilesDroppable._setDropMessageTitleState(this._element, false);

            // ✅ сортировка: не трогаем input
            if (this._isSortableDrag(e)) {
                return;
            }

            const files = e.dataTransfer?.files;
            if (!files || !files.length) return;

            this._files = files;

            if (isElement(this._input)) {
                this._input.files = files;
                EventHandler.trigger(this._input, 'change');
            }
        });
    }

    _bindGlobalEvents() {
        if (VGFilesDroppable._isGlobalEventsBound) return;

        VGFilesDroppable._globalHandlers = {
            dragenter: (e) => this._updateSuggestedDrop(e),
            dragover: (e) => this._updateSuggestedDrop(e),
            dragleave: (e) => {
                if (!this._isFileDrag(e)) return;
                if (e.relatedTarget === null || e.target === document || e.target === document.documentElement) {
                    VGFilesDroppable._clearSuggestedDrop();
                }
            },
            drop: (e) => {
                if (!this._isFileDrag(e)) {
                    VGFilesDroppable._clearSuggestedDrop();
                    return;
                }

                const activeDrop = VGFilesDroppable._activeSuggestedDrop;
                if (activeDrop) {
                    const instance = Array.from(VGFilesDroppable._smartInstances).find(i => i._element === activeDrop);
                    const files = e.dataTransfer?.files;

                    if (instance && files && files.length && isElement(instance._input)) {
                        e.preventDefault();
                        e.stopPropagation();
                        instance._files = files;
                        instance._input.files = files;
                        EventHandler.trigger(instance._input, 'change');
                    }
                }

                VGFilesDroppable._clearSuggestedDrop();
            },
            dragend: () => VGFilesDroppable._clearSuggestedDrop(),
        };

        EventHandler.on(document, 'dragenter', VGFilesDroppable._globalHandlers.dragenter);
        EventHandler.on(document, 'dragover', VGFilesDroppable._globalHandlers.dragover);
        EventHandler.on(document, 'dragleave', VGFilesDroppable._globalHandlers.dragleave);
        EventHandler.on(document, 'drop', VGFilesDroppable._globalHandlers.drop);
        EventHandler.on(document, 'dragend', VGFilesDroppable._globalHandlers.dragend);

        EventHandler.on(window, 'dragenter', VGFilesDroppable._globalHandlers.dragenter);
        EventHandler.on(window, 'dragover', VGFilesDroppable._globalHandlers.dragover);
        EventHandler.on(window, 'dragleave', VGFilesDroppable._globalHandlers.dragleave);
        EventHandler.on(window, 'drop', VGFilesDroppable._globalHandlers.drop);
        EventHandler.on(window, 'dragend', VGFilesDroppable._globalHandlers.dragend);

        VGFilesDroppable._isGlobalEventsBound = true;
    }

    _updateSuggestedDrop(e) {
        if (!this._isFileDrag(e)) {
            VGFilesDroppable._clearSuggestedDrop();
            return;
        }

        const visibleDrops = this._getVisibleDropZonesInViewport();

        if (visibleDrops.length === 1) {
                const [dropZone] = visibleDrops;
                if (VGFilesDroppable._activeSuggestedDrop !== dropZone) {
                    VGFilesDroppable._clearSuggestedDrop();
                    Classes.add(dropZone, CLASS_NAME_DROP_ACTIVE);
                    VGFilesDroppable._setDropMessageTitleState(dropZone, true);
                    VGFilesDroppable._activeSuggestedDrop = dropZone;
                }

            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            e.preventDefault();
            return;
        }

        VGFilesDroppable._clearSuggestedDrop();
    }

    _isFileDrag(e) {
        try {
            if (this._isSortableDrag(e)) return false;

            const dt = e?.dataTransfer;
            if (!dt) return false;

            if (dt.files && dt.files.length > 0) return true;

            if (dt.items && dt.items.length > 0) {
                return Array.from(dt.items).some(item => item.kind === 'file');
            }

            if (dt.types) {
                return Array.from(dt.types).includes('Files');
            }

            return false;
        } catch (_) {
            return false;
        }
    }

    _isSortableDrag(e) {
        if (isVGFilesSortableDragActive()) return true;
        if (document.querySelector('.dragging')) return true;

        try {
			const dataTransfer = e?.dataTransfer;
			const types = Array.from(dataTransfer?.types || []);
			if (types.includes(VG_FILES_SORTABLE_DATA_TYPE)) return true;

			return (dataTransfer?.getData?.(VG_FILES_SORTABLE_DATA_TYPE) || '') === '1' ||
				(dataTransfer?.getData?.('text/plain') || '') === 'vgsortable';
        } catch (_) {
            return false;
        }
    }

    _getVisibleDropZonesInViewport() {
        const dropZones = Array.from(Selectors.findAll(`.${CLASS_NAME_DROP}`) || []);
        return dropZones.filter((el) => this._isVisibleInViewport(el));
    }

    _isVisibleInViewport(el) {
        if (!isElement(el) || !el.isConnected) return false;

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }

        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;

        const inViewport =
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth;

        return inViewport;
    }

    static _clearSuggestedDrop() {
        if (!VGFilesDroppable._activeSuggestedDrop) return;

        VGFilesDroppable._setDropMessageTitleState(VGFilesDroppable._activeSuggestedDrop, false);
        Classes.remove(VGFilesDroppable._activeSuggestedDrop, CLASS_NAME_DROP_ACTIVE);
        VGFilesDroppable._activeSuggestedDrop = null;
    }

    static _setDropMessageTitleState(dropElement, isActive) {
        if (!isElement(dropElement)) return;

        const title = Selectors.find('.vg-files-drop-message .title', dropElement);
        if (!title) return;

        const originalText = (title.getAttribute('data-drop-original-text') || '').trim() || (title.textContent || '').trim();
        title.setAttribute('data-drop-original-text', originalText);

        const activeText = (dropElement.getAttribute('data-drop-active-text') || '').trim();
        if (isActive && activeText) {
            title.textContent = activeText;
            return;
        }

        title.textContent = originalText;
    }

    static _unbindGlobalEvents() {
        if (!VGFilesDroppable._isGlobalEventsBound) return;

        const handlers = VGFilesDroppable._globalHandlers || {};

        EventHandler.off(document, 'dragenter', handlers.dragenter);
        EventHandler.off(document, 'dragover', handlers.dragover);
        EventHandler.off(document, 'dragleave', handlers.dragleave);
        EventHandler.off(document, 'drop', handlers.drop);
        EventHandler.off(document, 'dragend', handlers.dragend);

        EventHandler.off(window, 'dragenter', handlers.dragenter);
        EventHandler.off(window, 'dragover', handlers.dragover);
        EventHandler.off(window, 'dragleave', handlers.dragleave);
        EventHandler.off(window, 'drop', handlers.drop);
        EventHandler.off(window, 'dragend', handlers.dragend);

        VGFilesDroppable._isGlobalEventsBound = false;
        VGFilesDroppable._globalHandlers = null;
        VGFilesDroppable._clearSuggestedDrop();
    }

    getFiles() {
        return this._files;
    }

    dispose() {
        EventHandler.off(this._element, `click.${NAME_KEY}`);
        EventHandler.off(this._element, 'dragover');
        EventHandler.off(this._element, 'dragenter');
        EventHandler.off(this._element, 'dragleave');
        EventHandler.off(this._element, 'drop');

        VGFilesDroppable._instances.delete(this);
        VGFilesDroppable._smartInstances.delete(this);
        if (!VGFilesDroppable._smartInstances.size) {
            VGFilesDroppable._unbindGlobalEvents();
        }

        this._input = null;
        this._files = null;
    }

    init() {
        return this;
    }
}

VGFilesDroppable._instances = new Set();
VGFilesDroppable._smartInstances = new Set();
VGFilesDroppable._isGlobalEventsBound = false;
VGFilesDroppable._activeSuggestedDrop = null;
VGFilesDroppable._globalHandlers = null;

export default VGFilesDroppable;
