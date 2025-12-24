import BaseModule from "../../base-module";
import {isElement, isVisible, mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import Html from "../../../utils/js/components/templater";
import { lang_messages } from "../../../utils/js/components/lang";
import {getSVG} from "../../module-fn";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { Manipulator, Classes } from "../../../utils/js/dom/manipulator";
import FileUploader from "./loader";
import Droper from "./droper";
import VGAlert from "../../vgalert";

/**
 * Constants
 */
const NAME = 'files';
const NAME_KEY = 'vg.files';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="files"]';
const SELECTOR_DATA_DISMISS = '[data-vg-dismiss="file"]';
const SELECTOR_DATA_DISMISS_ALL = '[data-vg-dismiss="vg-files"]';
const SELECTOR_DATA_FAKE = '[data-vg-files="generated"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_INFO = `${CLASS_NAME_CONTAINER}-info`;
const CLASS_NAME_IMAGES = `${CLASS_NAME_INFO}--images`;
const CLASS_NAME_LIST = `${CLASS_NAME_INFO}--list`;
const CLASS_NAME_DROP = `${CLASS_NAME_CONTAINER}-drop`;
const CLASS_NAME_ERRORS = `${CLASS_NAME_CONTAINER}-errors`;
const CLASS_NAME_PENDING  = 'pending';
const CLASS_NAME_LOADING = 'loading';
const CLASS_NAME_LOADED = 'loaded';
const CLASS_NAME_FAILING = 'failing';

const EVENT_KEY_CHANGE = `${NAME_KEY}.change`;
const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_DISMISS_DATA_API = `click.${NAME_KEY}.data.api`;

class VGFiles extends BaseModule {
    constructor(element, params = {}) {
        super(element, params);

        this._params = this._getParams(this._element, mergeDeepObject({
            allowed: true,
            lang: document.documentElement.lang || 'ru',
            limits: {
                count: 0,
                sizes: 10,
                total: 0
            },
            image: false,
            detach: true,
            info: true,
            types: [],
            ajax: false,
            uploads: {
                mode: 'sequential', // sequential | parallel
                route: '', // Ссылка на сервер загрузки файлов
                maxParallel: 3, // Количество файлов при параллельной загрузке
                maxConcurrent: 1, // Количество файлов при последовательной загрузке
                retryAttempts: 3, // Повтор неудачных отправок
                retryDelay: 1000, // Задержка при повторной отправке
                callbacks: {
                    progress: [],
                    complete: [],
                    error: [],
                    allComplete: []
                }
            }
        }, params));

        const toggleEl = Selectors.find('[data-vg-toggle]', this._element);
        this.id = toggleEl?.id || undefined;
        this.name = toggleEl?.name || 'files[]';
        this.accept = toggleEl?.accept || undefined;

        this._tpl = Html('dom');
        this._files = [];
        this._errors = new Set();
        this._objectUrls = [];
        this._uploadedKeys = new Set();
        this._uploader = null;

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
        this._preventOriginalInputFromSubmit();
        if (this._nodes.drop) new Droper(this._nodes.drop, this._params).init();
    }

    build() {
        if (!this._nodes.info) return;
        this._updateCounter();
        this.change();
    }

    change(input = null) {
        const incomingFiles = input?.files || this._files;
        if (!incomingFiles.length || input?.files?.length === 0) return;

        if (!this._params.ajax) this.clear();
        if (!this._params.allowed) return;

        this._cleanupErrors();
        const processedFiles = this.append(incomingFiles);

        if (processedFiles.length) {
            if (this._params.ajax) {
                this.uploadAll(processedFiles);
            } else {
                this._generateHiddenInputs(processedFiles);
                this._renderUI(processedFiles);
            }
        }

        EventHandler.trigger(this._element, EVENT_KEY_CHANGE, { files: processedFiles });
    }

    async uploadAll(files) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        const notUploadedFiles = files.filter(f => !this._uploadedKeys.has(this._getFileKey(f)));
        if (!notUploadedFiles.length) return;

        this._uploader = new FileUploader({
            mode: this._params.uploads.mode,
            maxConcurrent: this._params.uploads.maxConcurrent,
            maxParallel: this._params.uploads.maxParallel,
            retryAttempts: this._params.uploads.retryAttempts,
            retryDelay: this._params.uploads.retryDelay
        });

        this._renderUI(this._files);

        // Прогресс
        this._uploader.onProgress((uploadData) => {
            const $item = this._getItemElement(uploadData.file);
            Classes.add($item, CLASS_NAME_LOADING)
        });

        // Успешно
        this._uploader.onComplete((uploadData) => {
            this._uploadedKeys.add(this._getFileKey(uploadData.file));
            const $item = this._getItemElement(uploadData.file);

            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_LOADED)
            Classes.remove($item, CLASS_NAME_PENDING);

            let button = this._getButtonElement(uploadData.file),
                id = normalizeData(uploadData.result.response.id) || uploadData.id || uploadData.file.lastModified;

            if (isElement(button) && id) {
                Manipulator.set(button, 'data-id', id);
            }
        });

        // Ошибка
        this._uploader.onError((uploadData, error) => {
            this._uploadedKeys.delete(this._getFileKey(uploadData.file));
            const $item = this._getItemElement(uploadData.file);
            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_FAILING)
            console.error('Upload error:', error);
        });

        // Все завершены
        this._uploader.onAllComplete(() => {
            EventHandler.trigger(this._element, `${NAME_KEY}.upload.allComplete`);
        });

        const uploadParams = {
            additionalData: {
                timestamp: new Date().toISOString(),
                source: 'web_uploader'
            }
        };

        try {
            await this._uploader.uploadFiles(notUploadedFiles, this._params.uploads.route, uploadParams);
        } catch (error) {
            console.error('Bulk upload failed:', error);
        }
    }

    _getItemElement(file) {
        return Selectors.find(
            `.${CLASS_NAME_LIST} li[data-name="${file.name}"][data-size="${file.size}"], 
             .${CLASS_NAME_IMAGES} span[data-name="${file.name}"][data-size="${file.size}"]`,
            this._element
        );
    }

    _getButtonElement(file) {
        if (typeof file === 'string') {
            return Selectors.find(file, this._element);
        } else {
            return Selectors.find(`button[data-name="${file.name}"][data-size="${file.size}"]`, this._element);
        }
    }

    _setButtonElement(file) {
        return this._tpl.button([
            this._tpl.i({}, getSVG('cross'), {isHTML: true}),
        ], 'button', {
            type: 'button',
            'data-vg-dismiss': 'file',
            'data-name': file.name,
            'data-size': file.size,
            'data-type': file.type
        })
    }

    _renderUI(files) {
        if (!this._nodes.info) return;

        Classes.add(this._nodes.info, 'show');
        this._updateCounter();
        this._renderImages(files);
        this._renderInfoList(files);

        // Визуальное обновление состояния загрузки
        files.forEach(file => {
            const $item = this._getItemElement(file);
            if (!$item) return;

            const key = this._getFileKey(file);
            if (this._uploadedKeys.has(key)) {
                Classes.add($item, CLASS_NAME_LOADED);
            } else {
                Classes.add($item, CLASS_NAME_PENDING);
            }
        });
    }

    _updateCounter() {
        if (!this._nodes.info) return;
        const $count = Selectors.find(`.${CLASS_NAME_INFO}--wrapper-count`, this._nodes.info);
        if (!$count) return;

        const totalSize = this._getSizes(this._files, true);
        $count.innerHTML = this._files.length
            ? `${this._files.length}<span>[${totalSize}]</span>`
            : '';
    }

    _renderImages(files) {
        if (!this._params.image || !this._nodes.info) return;

        let $container = Selectors.find(`.${CLASS_NAME_IMAGES}`, this._element);
        if (!$container) {
            $container = this._tpl.div({ class: CLASS_NAME_IMAGES });
            this._nodes.info.prepend($container);
        }

        const fragment = document.createDocumentFragment();
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const src = URL.createObjectURL(file);
                this._objectUrls.push(src);
                const $span = this._tpl.span({}, [this._tpl.img(src, file.name)]);
                $span.dataset.name = file.name;
                $span.dataset.size = file.size;

                if (this._params.detach) {
                    $span.append(this._setButtonElement(file));
                }
                fragment.appendChild($span);
            }
        });
        $container.appendChild(fragment);
    }

    _renderInfoList(files) {
        if (!this._params.info || !this._nodes.info) return;

        let $list = Selectors.find(`.${CLASS_NAME_LIST}`, this._element);
        if (!$list) {
            $list = this._tpl.ul([], { class: CLASS_NAME_LIST });
            this._nodes.info.append($list);
        }

        const fragment = document.createDocumentFragment();
        files.forEach((file, i) => {
            const $li = this._tpl.li(
                { 'data-name': file.name, 'data-size': file.size },
                [
                    this._tpl.span({ class: 'iteration' }, `${i + 1}.`),
                    this._tpl.span({ class: 'name' }, file.name),
                    this._tpl.span({ class: 'size' }, `[${this._getSizes(file.size)}]`)
                ]
            );

            if (this._params.detach) {
                $li.append(this._setButtonElement(file));
            }
            fragment.appendChild($li);
        });

        $list.innerHTML = '';
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
        const fileMap = new Map(this._files.map(f => [this._getFileKey(f), f]));

        Array.from(values).forEach(file => {
            fileMap.set(this._getFileKey(file), file);
        });

        this._files = this._filterFiles(Array.from(fileMap.values()));
        this._renderErrors();

        return this._files;
    }

    removeFile(button) {
        const name = normalizeData(Manipulator.get(button, 'data-name'));
        const size = normalizeData(Manipulator.get(button, 'data-size'));

        const fileToRemove = this._files.find(f => f.name === name && f.size === size);
        if (fileToRemove) {
            const key = this._getFileKey(fileToRemove);
            this._uploadedKeys.delete(key);
        }

        this._files = this._files.filter(f => !(f.name === name && f.size === size));
        this._files.length ? this.build() : this.clear(true);
    }

    _filterFiles(files) {
        this._errors.clear();
        const { count, sizes, total } = this._params.limits;
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

            if (this._params.types.length && !this._params.types.includes(file.type)) {
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

            if (isValid) filtered.push(file);
        }

        return filtered;
    }

    _getSizes(size, isArray = false) {
        const totalSize = isArray ? this._files.reduce((acc, f) => acc + f.size, 0) : size;
        const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];
        const index = totalSize > 0 ? Math.min(Math.floor(Math.log(totalSize) / Math.log(1024)), units.length - 1) : 0;
        const value = totalSize / Math.pow(1024, index);

        return new Intl.NumberFormat(this._params.lang, {
            style: 'unit',
            unit: units[index],
            unitDisplay: 'short',
            maximumFractionDigits: 2
        }).format(value);
    }

    _cleanupFakeInputs() {
        Selectors.findAll(SELECTOR_DATA_FAKE, this._element).forEach(el => el.remove());
    }

    _cleanupErrors() {
        this._errors.clear();
        const $errorCont = Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element);
        if ($errorCont) $errorCont.remove();
    }

    _renderErrors() {
        if (!this._errors.size) return;

        const messages = lang_messages(this._params.lang, NAME) || this._getFallbackErrors();
        let $errorCont = Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element);

        if (!$errorCont) {
            $errorCont = this._tpl.div({ class: CLASS_NAME_ERRORS });
            const $info = Selectors.find(`.${CLASS_NAME_INFO}`, this._element);
            if ($info) $info.before($errorCont);
        }

        this._errors.forEach(errKey => {
            const msg = messages[errKey] || errKey;
            $errorCont.append(this._tpl.span({ class: 'error-item' }, msg));
        });
    }

    _getFallbackErrors() {
        const { count, sizes, total } = this._params.limits;
        return {
            'is-count': `Limit: ${count}`,
            'is-sizes': `Max size: ${sizes}MB`,
            'is-total-size': `Total max size: ${total}MB`,
            'is-types': `Allowed: ${this._params.types.join(', ')}`
        };
    }

    _addEventListener() {
        Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
            el.addEventListener('change', () => this.change(el));
        });
    }

    _getFileKey(file) {
        return `${file.name}-${file.size}-${file.lastModified}`;
    }

    _preventOriginalInputFromSubmit(isRestore = false) {
       if (!isRestore) {
           const originalInput = Selectors.find(SELECTOR_DATA_TOGGLE, this._element);
           if (originalInput && !originalInput.dataset.originalName) {
               originalInput.dataset.originalName = originalInput.name;
               originalInput.removeAttribute('name');
           }
       } else {
           this._restoreOriginalInputForSubmit();
       }
    }

    _restoreOriginalInputForSubmit() {
        const originalInput = Selectors.find(SELECTOR_DATA_TOGGLE, this._element);
        if (originalInput && originalInput.dataset.originalName) {
            originalInput.name = originalInput.dataset.originalName;
            delete originalInput.dataset.originalName;
        }
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
            this._uploadedKeys.clear();
        }
    }

    _revokeUrls() {
        this._objectUrls.forEach(url => URL.revokeObjectURL(url));
        this._objectUrls = [];
    }

    dispose() {
        this.clear(true);
        if (this._uploader) this._uploader.destroy();
        super.dispose();
    }
}

EventHandler.on(document, EVENT_KEY_DOM_LOADED_DATA_API, () => {
    Selectors.findAll(`.${CLASS_NAME_CONTAINER}`).forEach(el => VGFiles.getOrCreateInstance(el));
});

EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (!target) return;
    e.preventDefault();

    let button = e.target.closest(SELECTOR_DATA_DISMISS) || e.target;
    VGFiles.getOrCreateInstance(target).removeFile(button);
});

EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS_ALL, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (!target) return;
    e.preventDefault();

    VGFiles.getOrCreateInstance(target).clear(true);
});

export default VGFiles;