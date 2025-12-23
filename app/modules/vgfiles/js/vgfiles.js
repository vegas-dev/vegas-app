import BaseModule from "../../base-module";
import {mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import Html from "../../../utils/js/components/templater";
import {Manipulator, Classes} from "../../../utils/js/dom/manipulator";
import DragDropFiles from "./dragDropFiles";
import {lang_messages} from "../../../utils/js/components/lang";


/**
 * Constants
 */
const NAME                  = 'files';
const NAME_KEY              = 'vg.files';
const SELECTOR_DATA_TOGGLE  = '[data-vg-toggle="files"]';
const SELECTOR_DATA_DISMISS = '[data-dismiss="file"]';
const SELECTOR_DATA_FAKE    = '[data-vg-files="generated"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_INFO      = `${CLASS_NAME_CONTAINER}-info`;
const CLASS_NAME_IMAGES    = `${CLASS_NAME_INFO}--images`;
const CLASS_NAME_LIST      = `${CLASS_NAME_INFO}--list`;
const CLASS_NAME_DROP      = `${CLASS_NAME_CONTAINER}-drop`;
const CLASS_NAME_ERRORS    = `${CLASS_NAME_CONTAINER}-errors`;
const CLASS_NAME_PENDING   = 'pending';
const CLASS_NAME_LOADING   = 'loading';
const CLASS_NAME_LOADED    = 'loaded';
const CLASS_NAME_FAILING   = 'failing';

const EVENT_KEY_CHANGE              = `${NAME_KEY}.change`;
const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_DISMISS_DATA_API    = `click.${NAME_KEY}.data.api`;

class VGFiles extends BaseModule {
    constructor(element, params = {}) {
        super(element, params);

        this._params = this._getParams(this._element, mergeDeepObject({
            allowed: true,
            lang: document.documentElement.lang || 'ru',
            limits: {
                count: 0,
                sizes: 10, // MB per file
                total: 0   // MB for all files (0 - no limit)
            },
            image: false,
            detach: true,
            info: true,
            types: [], // 'image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff", "image/webp"
            ajax: {
                enabled: true,
                route: 'api/upload/file',
                method: 'POST',
                queue: true
            }
        }, params));

        const toggleEl = Selectors.find('[data-vg-toggle]', this._element);
        this.id     = toggleEl?.id || undefined;
        this.name   = toggleEl?.name || 'files[]';
        this.accept = toggleEl?.getAttribute('accept') || undefined;

        this._tpl    = Html('dom');
        this._files  = [];
        this._errors = [];
        this._objectUrls = [];
        this._uploadedKeys = new Set();
        this.isPreventOriginalSubmit = true;

        this._nodes = {
            info: Selectors.find(`.${CLASS_NAME_INFO}`, this._element),
            drop: Selectors.find(`.${CLASS_NAME_DROP}`, this._element)
        };

        this._init();
        this._addEventListener();
    }

    static get NAME() { return NAME; }
    static get NAME_KEY() { return NAME_KEY; }

    _init() {
        if (this._nodes.drop) {
            new DragDropFiles(this._nodes.drop, this._params).init();
        }
    }

    build() {
        if (!this._nodes.info) return;

        this._updateCounter();
        this.change();
    }

    change(input = null) {
        const incomingFiles = input?.files || this._files;

        if (input && !input.files.length) {
            return;
        }

        this.clear();
        if (!this._params.allowed) {
            this._files = [];
            return;
        }

        if (incomingFiles.length) {
            this._cleanupErrors();
            const processedFiles = this.append(incomingFiles);

            if (processedFiles.length) {
                if (this.isPreventOriginalSubmit) {
                    this._preventOriginalInputFromSubmit();
                } else {
                    this._restoreOriginalInputForSubmit();
                }

                if (this._params.ajax.enabled) {
                    this.uploadAll(this._files)
                } else {
                    this._generateHiddenInputs(processedFiles);
                    this._renderUI(processedFiles);
                }
            }

            EventHandler.trigger(this._element, EVENT_KEY_CHANGE, { files: processedFiles });
        }
    }

    uploadAll(files) {
        if (!this._params.ajax.enabled || !this._params.ajax.route) return;

        Classes.add(this._nodes.info, 'show');
        this._files = [];

        const filesToUpload = files.filter(file => {
            const key = this._getFileKey(file);
            return !this._uploadedKeys.has(key);
        });

        this._renderUI(filesToUpload, true)

        if (this._params.ajax.queue) {
            let timer = 0, i = 1;
            for (const file of filesToUpload) {
                setTimeout(() => {
                    this.uploadFile(file);
                    i++;
                }, timer)

                timer += 200;
            }
        }
    }

    uploadFile(file) {
        const key = this._getFileKey(file);
        if (this._uploadedKeys.has(key)) return;

    }

    _renderUI(files, isLoad = false) {
        if (!this._nodes.info) return;

        Classes.add(this._nodes.info, 'show');
        this._updateCounter(isLoad);
        this._renderImages(files, isLoad);
        this._renderInfoList(files, isLoad);
    }

    _updateCounter(isLoad = false) {
        if (!this._nodes.info) return;
        const $count = Selectors.find(`.${CLASS_NAME_INFO}--wrapper-count`, this._nodes.info);
        if ($count) {
            const sizeText = this._files.length ? `<span>[${this._getSizes(this._files, true)}]</span>` : '';
            $count.innerHTML = `${this._files.length}${sizeText}`;
        }
    }

    _renderImages(files, isLoad = false) {
        if (!this._params.image || !this._nodes.info) return;

        let $container = Selectors.find(`.${CLASS_NAME_IMAGES}`, this._element),
            containerClass = '';

        if (isLoad) containerClass = CLASS_NAME_PENDING;

        if (!$container) {
            $container = this._tpl.div({ class: CLASS_NAME_IMAGES });
            this._nodes.info.prepend($container);
        }

        const fragment = document.createDocumentFragment();
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const src = URL.createObjectURL(file);
                this._objectUrls.push(src);
                fragment.appendChild(this._tpl.span({class: containerClass}, [this._tpl.img(src, file.name)]));
            }
        });
        $container.appendChild(fragment);
    }

    _renderInfoList(files, isLoad = false) {
        if (!this._params.info || !this._nodes.info) return;

        let $list = Selectors.find(`.${CLASS_NAME_LIST}`, this._element);

        if (!$list) {
            $list = this._tpl.ul([], { class: CLASS_NAME_LIST });
            this._nodes.info.append($list);
        }

        const fragment = document.createDocumentFragment();
        files.forEach((file, i) => {
            const $li = this._tpl.li({}, [
                this._tpl.span({class: 'iteration'}, `${i + 1}.`),
                this._tpl.span({class: 'name'}, file.name),
                this._tpl.span({class: 'size'}, `[${this._getSizes(file.size)}]`)
            ]);

            if (this._params.detach) {
                $li.append(this._tpl.button('✕', 'button', {
                    type: 'button',
                    'data-dismiss': 'file',
                    'data-name': file.name,
                    'data-size': file.size,
                    'data-type': file.type
                }));
            }
            fragment.appendChild($li);
        });
        $list.appendChild(fragment);
    }

    _generateHiddenInputs(files) {
        this._cleanupFakeInputs();
        const fragment = document.createDocumentFragment();

        files.forEach((file, index) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.name = `${this.name.replace('[]', '')}[${index}]`;
            input.dataset.vgFiles = 'generated';
            Manipulator.hide(input);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            fragment.appendChild(input);
        });

        this._element.appendChild(fragment);
    }

    append(values) {
        const fileMap = new Map(this._files.map(f => [`${f.name}-${f.size}-${f.lastModified}`, f]));

        Array.from(values).forEach(file => {
            fileMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
        });

        this._files = this._filterFiles(Array.from(fileMap.values()));
        this._renderErrors();

        return this._files;
    }

    removeFile(button) {
        const name = normalizeData(Manipulator.get(button, 'data-name'));
        const size = normalizeData(Manipulator.get(button, 'data-size'));

        this._files = this._files.filter(f => !(f.name === name && f.size === size));
        this._files.length ? this.build() : this.clear(true);
    }

    clear(all = false) {
        this._revokeUrls();

        [`.${CLASS_NAME_IMAGES}`, `.${CLASS_NAME_LIST}`].forEach(selector => {
            const el = Selectors.find(selector, this._element);
            if (el) el.innerHTML = '';
        });

        if (all) {
            Selectors.findAll('[type="file"]', this._element).forEach(i => i.value = '');
            this._cleanupFakeInputs();
            this._cleanupErrors();

            if (this._nodes.info) Classes.remove(this._nodes.info, 'show');
            this._files = [];
        }
    }

    _revokeUrls() {
        this._objectUrls.forEach(url => URL.revokeObjectURL(url));
        this._objectUrls = [];
    }

    _filterFiles(files) {
        this._errors = new Set();
        const { sizes, total, count } = this._params.limits;
        const maxSize = sizes * 1024 * 1024;
        const maxTotalSize = total * 1024 * 1024;

        let currentTotalSize = 0;
        const filtered = [];

        for (const file of files) {
            if (count > 0 && filtered.length >= count) {
                this._errors.add('is-count');
                break;
            }

            let isValid = true;

            if (this._params.types?.length && !this._params.types.includes(file.type)) {
                this._errors.add('is-types');
                isValid = false;
            }

            if (file.size > maxSize) {
                this._errors.add('is-sizes');
                isValid = false;
            }

            if (isValid && maxTotalSize > 0) {
                if (currentTotalSize + file.size > maxTotalSize) {
                    this._errors.add('is-total-size');
                    isValid = false;
                } else {
                    currentTotalSize += file.size;
                }
            }

            if (isValid) {
                filtered.push(file);
            }
        }

        return filtered;
    }

    _getSizes(size, isArray = false) {
        const totalSize = isArray ? size.reduce((acc, f) => acc + f.size, 0) : size;
        const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];
        const index = totalSize > 0 ? Math.min(Math.floor(Math.log(totalSize) / Math.log(1024)), units.length - 1) : 0;

        return new Intl.NumberFormat(this._params.lang, {
            style: 'unit',
            unit: units[index],
            unitDisplay: 'short',
            maximumFractionDigits: 2
        }).format(totalSize / Math.pow(1024, index));
    }

    _cleanupFakeInputs() {
        Selectors.findAll(SELECTOR_DATA_FAKE, this._element).forEach(el => el.remove());
    }

    _cleanupErrors() {
        this._errors = new Set();
        Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element)?.remove();
    }

    _renderErrors() {
        if (!this._errors.size) return;

        const messages = lang_messages(this._params.lang, NAME) || this._getFallbackErrors();

        let $errorCont = Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element);
        if (!$errorCont) {
            $errorCont = this._tpl.div({ class: CLASS_NAME_ERRORS });
            Selectors.find(`.${CLASS_NAME_INFO}`, this._element)?.before($errorCont);
        }

        this._errors.forEach(errKey => {
            const msg = messages[errKey] || errKey;
            $errorCont.append(this._tpl.span({ class: 'error-item' }, [this._tpl.span({}, msg)]));
        });
    }

    _getFallbackErrors() {
        return {
            'is-count': `Limit: ${this._params.limits.count}`,
            'is-sizes': `Max size: ${this._params.limits.sizes}MB`,
            'is-total-size': `Total max size: ${this._params.limits.total}MB`,
            'is-types': `Allowed: ${this._params.types.join(', ')}`
        };
    }

    _addEventListener() {
        Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
            el.addEventListener('change', () => this.change(el));
        });

        const $dismiss = Selectors.find('[data-dismiss="vg-files"]', this._element);
        $dismiss?.addEventListener('click', (e) => {
            e.preventDefault();
            this.clear(true);
        });
    }

    _getFileKey(file) {
        return `${file.name}-${file.size}-${file.lastModified}`;
    }

    /**
     * Метод, который делает оригинальный инпут НЕучастником отправки
     * @private
     */
    _preventOriginalInputFromSubmit() {
        const originalInput = Selectors.find(SELECTOR_DATA_TOGGLE, this._element);
        if (originalInput) {
            // Сохраняем оригинальное имя, чтобы можно было восстановить
            if (!originalInput.dataset.originalName) {
                originalInput.dataset.originalName = originalInput.name;
                originalInput.removeAttribute('name'); // 🔥 Убираем name → не попадёт в FormData
            }
        }
    }

    /**
     * Восстановление оригинального поведения (если нужно)
     * @private
     */
    _restoreOriginalInputForSubmit() {
        const originalInput = Selectors.find(SELECTOR_DATA_TOGGLE, this._element);
        if (originalInput && originalInput.dataset.originalName) {
            originalInput.name = originalInput.dataset.originalName;
            delete originalInput.dataset.originalName;
        }
    }

    dispose() {
        this.clear(true);
        super.dispose();
    }
}

/**
 * Data API
 */
EventHandler.on(document, EVENT_KEY_DOM_LOADED_DATA_API, () => {
    Selectors.findAll(`.${CLASS_NAME_CONTAINER}`).forEach(el => VGFiles.getOrCreateInstance(el));
});

EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS, function (event) {
    const target = event.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (!target) return;
    event.preventDefault();
    VGFiles.getOrCreateInstance(target).removeFile(this);
});

export default VGFiles;
