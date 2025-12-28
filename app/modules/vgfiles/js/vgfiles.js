import VGFilesBase from "./base";
import FileUploader from "./loader";
import DnD from "./dnd";
import { getSVG } from "../../module-fn";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { isElement, normalizeData } from "../../../utils/js/functions";
import { Classes, Manipulator } from "../../../utils/js/dom/manipulator";

const NAME = 'files';
const NAME_KEY = 'vg.files';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="files"]';
const SELECTOR_DATA_RELOAD = '[data-vg-reload="file"]';
const SELECTOR_DATA_DISMISS = '[data-vg-dismiss="file"]';
const SELECTOR_DATA_DISMISS_ALL = '[data-vg-dismiss="vg-files"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_STAT = `${CLASS_NAME_CONTAINER}-stat`;
const CLASS_NAME_DROP = `${CLASS_NAME_CONTAINER}-drop`;
const CLASS_NAME_DROP_LIST = `${CLASS_NAME_CONTAINER}-drop--list`;
const CLASS_NAME_COMPLETED = 'completed';
const CLASS_NAME_PENDING = 'pending';
const CLASS_NAME_LOADING = 'loading';
const CLASS_NAME_FAILING = 'failing';
const CLASS_NAME_LOADED = 'loaded';

class VGFiles extends VGFilesBase {
    constructor(element, params = {}) {
        const defaults = {
            allowed: false,
            lang: document.documentElement.lang || 'ru',
            limits: { count: 0, sizes: 10, total: 0 },
            image: false,
            detach: true,
            info: true,
            types: [],
            ajax: false,
            uploads: {
                mode: 'sequential',
                route: '',
                maxParallel: 3,
                maxConcurrent: 1,
                retryAttempts: 1,
                retryDelay: 1000,
            },
            removes: {
                all: { route: '', alert: true, toast: true },
                single: { route: '', alert: true, toast: true }
            },
            callbacks: {
                onInit: null,
                onChange: null,
                onUploadStart: null,
                onUploadProgress: null,
                onUploadComplete: null,
                onUploadError: null,
                onUploadAllComplete: null,
                onRemoveFile: null,
                onClear: null,
                onReload: null
            }
        };

        super(element, params, defaults);

        this._files = [];
        this._uploadedKeys = new Set();
        this._failingUploadedKeys = new Set();
        this._pendingUploadedKeys = new Set();
        this._unUploadedFiles = [];
        this._uploader = null;

        this._initExtended();
    }

    static get NAME() { return NAME; }
    static get NAME_KEY() { return NAME_KEY; }

    _initExtended() {
        if (this._params.ajax) this._params.allowed = false;
        if (this._params.allowed && !this._params.ajax) this._params.detach = false;
        if (this._nodes.drop) {
            this._params.image = true;
            this._params.detach = true;
            new DnD(this._nodes.drop, this._params).init();
        }

        this._addEventListenerExtended();
        this._triggerCallback('onInit', { element: this._element });
    }

    _addEventListenerExtended() {
        Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
            el.removeEventListener('change', this.change.bind(this));
            el.addEventListener('change', e => this._handleChange(e));
        });
    }

    _handleChange(e) {
        this.change(e.target);
        if (this._params.ajax) this.uploadAll(this._files);
        this._triggerCallback('onChange', { files: this._files, input: e.target });
        EventHandler.trigger(this._element, `${NAME_KEY}.change`, { files: this._files });
    }

    async uploadAll(files) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        const notUploaded = files.filter(f => !this._uploadedKeys.has(this._getFileKey(f)));
        if (!notUploaded.length) return;

        if (!this._uploader || this._uploader.isIdle()) {
            this._uploader = new FileUploader({
                mode: this._params.uploads.mode,
                maxConcurrent: this._params.uploads.maxConcurrent,
                maxParallel: this._params.uploads.maxParallel,
                retryAttempts: this._params.uploads.retryAttempts,
                retryDelay: this._params.uploads.retryDelay
            });
        }

        notUploaded.forEach(f => {
            const key = this._getFileKey(f);
            this._pendingUploadedKeys.add(key);
            this._unUploadedFiles = this._unUploadedFiles.filter(uf => this._getFileKey(uf) !== key);
        });

        this._setStatItem('pending', this._pendingUploadedKeys.size);
        this._renderUI(this._files);
        this._setupUploadEventHandlers();

        try {
            await this._uploader.uploadFiles(notUploaded, this._params.uploads.route, {
                additionalData: { timestamp: new Date().toISOString(), source: 'web_uploader' }
            });
        } catch (e) {
            console.error('Bulk upload failed:', e);
        }
    }

    async upload(file) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        if (!this._uploader || this._uploader.isIdle()) {
            this._uploader = new FileUploader({
                mode: this._params.uploads.mode,
                maxConcurrent: this._params.uploads.maxConcurrent,
                maxParallel: this._params.uploads.maxParallel,
                retryAttempts: this._params.uploads.retryAttempts,
                retryDelay: this._params.uploads.retryDelay
            });
        }

        const key = this._getFileKey(file);
        if (!this._pendingUploadedKeys.has(key)) {
            this._pendingUploadedKeys.add(key);
            this._setStatItem('pending', this._pendingUploadedKeys.size);
        }

        this._unUploadedFiles = this._unUploadedFiles.filter(uf => this._getFileKey(uf) !== key);

        const $item = this._getItemElement(file);
        if ($item) {
            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_PENDING);
            Classes.add($item, CLASS_NAME_LOADING);
        }

        this._setupUploadEventHandlers();
        try {
            await this._uploader.uploadFiles([file], this._params.uploads.route, {
                additionalData: { timestamp: new Date().toISOString(), source: 'web_uploader' }
            });
        } catch (e) {
            console.error('Upload failed:', e);
        }
    }

    _setupUploadEventHandlers() {
        if (this._uploader.offAll) this._uploader.offAll();

        this._updateStat(true);

        this._uploader.onProgress((data) => {
            const $item = this._getItemElement(data.file);
            if (!$item) return;
            const button = this._getButtonElement(data.file);
            if (isElement(button)) {
                const li = button.closest('li');
                const fileRemove = Selectors.find('.file-remove', li);
                if (fileRemove) {
                    fileRemove.innerHTML = '';
                    fileRemove.appendChild(this._setButtonElement(data.file, true));
                }
            }
            this._triggerCallback('onUploadProgress', { file: data.file, progress: data.progress });
        });

        this._uploader.onComplete((data) => {
            const file = data.file;
            const key = this._getFileKey(file);
            const $item = this._getItemElement(file);
            if (!$item) return;

            file.id = normalizeData(data.result?.response?.id) || file.lastModified;
            this._uploadedKeys.add(key);
            this._failingUploadedKeys.delete(key);
            this._pendingUploadedKeys.delete(key);

            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_LOADED);
            this._setStatItem('completed', this._uploadedKeys.size);
            this._setStatItem('pending', this._pendingUploadedKeys.size);

            this._triggerCallback('onUploadComplete', { file, response: data.result?.response, id: file.id });
        });

        this._uploader.onError((data) => {
            const file = data.file;
            const key = this._getFileKey(file);
            const $item = this._getItemElement(file);
            if (!$item) return;

            this._uploadedKeys.delete(key);
            this._failingUploadedKeys.add(key);
            this._pendingUploadedKeys.delete(key);
            this._unUploadedFiles.push(file);

            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_FAILING);
            this._setStatItem('failing', this._failingUploadedKeys.size);
            this._setStatItem('pending', this._pendingUploadedKeys.size);

            this._triggerCallback('onUploadError', { file, error: data.error });
        });

        this._uploader.onAllComplete(() => {
            this._updateStat(false);
            this._triggerCallback('onUploadAllComplete', {
                uploaded: this._uploadedKeys.size,
                failed: this._failingUploadedKeys.size,
                total: this._files.length
            });
        });
    }

    reload(button) {
        const data = Manipulator.get(button, 'data');
        const fileData = { name: data.name, size: data.size, type: data.type, lastModified: data['last-modified'] };
        const key = this._getFileKey(fileData);
        if (!this._failingUploadedKeys.has(key)) return;

        const file = this._unUploadedFiles.find(f => this._getFileKey(f) === key);
        if (!file) return;

        this._failingUploadedKeys.delete(key);
        this._pendingUploadedKeys.add(key);
        this._setStatItem('failing', this._failingUploadedKeys.size);
        this._setStatItem('pending', this._pendingUploadedKeys.size);

        this._triggerCallback('onReload', { button, file });
        this.upload(file);
    }

    removeFile(button) {
        const name = normalizeData(Manipulator.get(button, 'data-name'));
        const size = normalizeData(Manipulator.get(button, 'data-size'));
        const id = normalizeData(Manipulator.get(button, 'data-id'));

        const key = this._getFileKey({ name, size });
        this._uploadedKeys.delete(key);
        this._failingUploadedKeys.delete(key);
        this._pendingUploadedKeys.delete(key);

        this._files = this._files.filter(f => !(f.name === name && f.size === size));

        const $item = this._getItemElement({ name, size });
        if ($item) $item.remove();

        this._updateStatsAfterRemove();

        if (this._files.length > 0) {
            this.build();
        } else {
            this.clear();
        }

        this._triggerCallback('onRemoveFile', { name, size, id, remaining: this._files.length });
    }

    _updateStatsAfterRemove() {
        this._setStatItem('completed', this._uploadedKeys.size);
        this._setStatItem('pending', this._pendingUploadedKeys.size);
        this._setStatItem('failing', this._failingUploadedKeys.size);
        this._updateStat();
    }

    _getItemElement(file) {
        const className = this._nodes.drop ? CLASS_NAME_DROP_LIST : `${this._getClass('info')}-list`;
        return Selectors.find(`.${className} li[data-name="${file.name}"][data-size="${file.size}"]`, this._element);
    }

    _getButtonElement(file) {
        return Selectors.find(`button[data-name="${file.name}"][data-size="${file.size}"]`, this._element);
    }

    _setButtonElement(file, isAjax = false, status = '') {
        let icon = getSVG('trash'), action = 'data-vg-dismiss';
        if (!this._params.info) icon = getSVG('cross');
        if (isAjax) {
            icon = getSVG('spinner');
            if (status === 'completed') icon = getSVG('check');
            else action = 'data-vg-reload';
        }
        if (this._failingUploadedKeys.has(this._getFileKey(file))) {
            icon = getSVG('spinner');
            action = 'data-vg-reload';
        }

        return this._tpl.button([
            this._tpl.i({}, icon, { isHTML: true })
        ], 'button', {
            type: 'button',
            [action]: 'file',
            'data-name': file.name,
            'data-size': file.size,
            'data-type': file.type,
            'data-last-modified': file.lastModified,
            'data-id': file.id || ''
        });
    }

    _renderStat() {
        const $progress = Selectors.find(`.${CLASS_NAME_STAT}-progress`, this._nodes.stat);
        if (!$progress) return;

        let $list = Selectors.find(`.${CLASS_NAME_STAT}-progress-list`, $progress);
        if (!$list) {
            $list = this._tpl.ul([
                ...['pending', 'completed', 'failing'].map(status => this._tpl.li(
                    { class: `stat-item ${status}`, 'data-count': '0' },
                    [this._tpl.span({ class: 'stat-label' }, getSVG('cloud-dot'), { isHTML: true }), this._tpl.span({ class: 'stat-value' }, 0)]
                ))
            ], { class: `${CLASS_NAME_STAT}-progress-list` });
            $progress.appendChild($list);
        }
    }

    _setStatItem(status, count) {
        const $item = Selectors.find(`.${CLASS_NAME_STAT}-progress-list li.${status}`, this._nodes.stat);
        if (!$item) return;
        Manipulator.set($item, 'data-count', count);
        const $value = Selectors.find('.stat-value', $item);
        if ($value) $value.innerHTML = count;
    }

    _triggerCallback(name, data) {
        const cb = this._params.callbacks?.[name];
        if (typeof cb === 'function') {
            try { cb.call(this, data, this); } catch (e) { console.error(`${name} callback error:`, e); }
        }
    }

    dispose() {
        this.clear();
        if (this._uploader) this._uploader.destroy();
        super.dispose();
    }
}

// Автоинициализация
EventHandler.on(document, `DOMContentLoaded.${NAME_KEY}.data.api`, () => {
    Selectors.findAll(`.${CLASS_NAME_CONTAINER}`).forEach(el => VGFiles.getOrCreateInstance(el));
});

EventHandler.on(document, `click.${NAME_KEY}.data.api`, SELECTOR_DATA_DISMISS, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (target) VGFiles.getOrCreateInstance(target).removeFile(e.target.closest(SELECTOR_DATA_DISMISS));
});

EventHandler.on(document, `click.${NAME_KEY}.data.api`, SELECTOR_DATA_RELOAD, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (target) VGFiles.getOrCreateInstance(target).reload(e.target.closest(SELECTOR_DATA_RELOAD));
});

EventHandler.on(document, `click.${NAME_KEY}.data.api`, SELECTOR_DATA_DISMISS_ALL, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (target) VGFiles.getOrCreateInstance(target).clear(true, true);
});

export default VGFiles;