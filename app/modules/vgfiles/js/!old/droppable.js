import { isElement } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { Classes } from "../../../utils/js/dom/manipulator";
import BaseModule from "../../base-module";

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_DROP = `${CLASS_NAME_CONTAINER}-drop`;

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

        const isSortableDrag = (e) => {
            // 1) если sortable реально активен — на элементе есть класс dragging
            if (document.querySelector('.dragging')) return true;

            // 2) маркер, который ставит sortable
            let plain = '';
            try { plain = e.dataTransfer?.getData?.('text/plain') || ''; } catch (_) {}
            return plain === 'vgsortable';
        };

        EventHandler.on(this._element, 'dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // ✅ Сортировка: НЕ подсвечиваем dropzone
            if (isSortableDrag(e)) {
                Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
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
            if (isSortableDrag(e)) {
                Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
                return;
            }

            Classes.add(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
        });

        EventHandler.on(this._element, 'dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // ✅ Сортировка: гарантированно без подсветки
            if (isSortableDrag(e)) {
                Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
                return;
            }

            if (e.target === this._element || e.target.closest('.' + CLASS_NAME_DROP) === this._element) {
                Classes.remove(this._element, CLASS_NAME_DROP_HOVER);
                setTimeout(() => {
                    if (!this._element.matches(':hover')) {
                        Classes.remove(this._element, CLASS_NAME_DROP_ACTIVE);
                    }
                }, 50);
            }
        });

        EventHandler.on(this._element, 'drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);

            // ✅ сортировка: не трогаем input
            if (isSortableDrag(e)) {
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

    getFiles() {
        return this._files;
    }

    dispose() {
        EventHandler.off(this._element, 'dragover');
        EventHandler.off(this._element, 'dragenter');
        EventHandler.off(this._element, 'dragleave');
        EventHandler.off(this._element, 'drop');
        this._input = null;
        this._files = null;
    }

    init() {
        return this;
    }
}

export default VGFilesDroppable;