import VGFilesBase from "./base";
import FileUploader from "./loader";
import VGFilesDroppable from "./droppable";
import {getSVG} from "../../module-fn";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {isElement, normalizeData} from "../../../utils/js/functions";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";
import {lang_buttons, lang_messages} from "../../../utils/js/components/lang";
import VGAlert from "../../vgalert";
import VGToast from "../../vgtoast";
import VGFilesTemplateRender from "./render";

const NAME = 'files';
const NAME_KEY = 'vg.files';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="files"]';
const SELECTOR_DATA_RELOAD = '[data-vg-reload="file"]';
const SELECTOR_DATA_DISMISS = '[data-vg-dismiss="file"]';
const SELECTOR_DATA_DISMISS_ALL = '[data-vg-dismiss="vg-files"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_STAT = `${CLASS_NAME_CONTAINER}-stat`;
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
            prepend: true,
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
            sortable: {
                enabled: false,
                route: '',
                handle: '.file',
                lists: [`vg-files-info--list`, `vg-files-drop--list`]
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
        this._sortable = null;

        this._render = new VGFilesTemplateRender(this, this._element, this._params);
        this.isRenderNonInit = false;
        this._initExtended();
    }

    static get NAME() { return NAME; }
    static get NAME_KEY() { return NAME_KEY; }

    _initExtended() {
        if (this._params.ajax) {
            this._params.allowed = false;

            if (this.isRenderNonInit) return;
            this.isRenderNonInit = this._render.init();
            if (this._render.parsedFiles.length) {
                this._addExternalFiles(this._render.parsedFiles);
            }
        }
        if (this._params.allowed && !this._params.ajax) this._params.detach = false;
        if (this._nodes.drop) {
            this._params.image = true;
            this._params.detach = true;

            VGFilesDroppable.getOrCreateInstance(this._nodes.drop, this._params).init();
        }

        this._addEventListenerExtended();
        this._renderStat();
        this._triggerCallback('onInit', { element: this._element });
    }

    _addExternalFiles(files) {
        if (!Array.isArray(files) || !files.length) return;

        files.forEach(fileData => {
            const file = new File([""], fileData.name, {
                type: fileData.type || "application/octet-stream",
                lastModified: fileData.lastModified || Date.now()
            });

            // Добавляем ID, если он есть
            Object.defineProperty(file, 'id', {
                value: fileData.id,
                writable: true,
                enumerable: true
            });

            // Добавляем Size, если он есть
            Object.defineProperty(file, 'size', {
                value: fileData.size,
                writable: true,
                enumerable: true
            });

            // Добавляем Src, если он есть
            Object.defineProperty(file, 'src', {
                value: fileData.src,
                writable: true,
                enumerable: true
            });

            const fileKey = this._getFileKey(file);

            // Помечаем как уже загруженные
            this._uploadedKeys.add(fileKey);
            this._pendingUploadedKeys.delete(fileKey);
            this._failingUploadedKeys.delete(fileKey);

            // Добавляем в общий список
            this._files.push(file);
        });

        // Перестраиваем интерфейс
        this._renderUI(this._files);

        // Обновляем статистику
        this._renderStat();
        this._updateStat();
        this._setStatItem('completed', this._uploadedKeys.size);

        // Если нужно — запустить sortable
        if (this._params.sortable?.enabled && this._params.sortable.route && !this._sortable) {
            import('./sortable.js').then(module => {
                this._sortable = new module.default(this, this._params.sortable);
            }).catch(err => {
                console.error('Ошибка загрузки VGFilesSortable:', err);
            });
        }

        // Триггерим изменение
        this._triggerCallback('onChange', { files: this._files });
        EventHandler.trigger(this._element, `${NAME_KEY}.change`, { files: this._files });
    }

    _addEventListenerExtended() {
        Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
            el.removeEventListener('change', this.change.bind(this));
            el.addEventListener('change', e => this._handleChange(e));
        });
    }

    _handleChange(e) {
        if (this._params.ajax) this.uploadAll(this._files);
        this._triggerCallback('onChange', { files: this._files, input: e?.target || e?.src || '' });
        EventHandler.trigger(this._element, `${NAME_KEY}.change`, { files: this._files });
    }

    async uploadAll(files) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        if (!this._uploadedKeys.size) {
            this._failingUploadedKeys.clear();
        }

        const notUploadedFiles = files.filter(f => !this._uploadedKeys.has(this._getFileKey(f)));
        if (!notUploadedFiles.length) return;

        if (!this._uploader || this._uploader.isIdle()) {
            this._uploader = new FileUploader({
                mode: this._params.uploads.mode,
                maxConcurrent: this._params.uploads.maxConcurrent,
                maxParallel: this._params.uploads.maxParallel,
                retryAttempts: this._params.uploads.retryAttempts,
                retryDelay: this._params.uploads.retryDelay
            });

            this._setupUploadEventHandlers();
        }

        notUploadedFiles.forEach(file => {
            const fileKey = this._getFileKey(file);
            this._pendingUploadedKeys.add(fileKey);
            this._unUploadedFiles = this._unUploadedFiles.filter(f => this._getFileKey(f) !== fileKey);
        });

        this._setStatItem('pending', this._pendingUploadedKeys.size);

        const uploadParams = {
            additionalData: {
                timestamp: new Date().toISOString(),
                source: 'web_uploader',
                prepend: this._params.prepend
            }
        };

        this._triggerCallback('onUploadStart', {
            files: notUploadedFiles,
            total: notUploadedFiles.length
        });

        try {
            await this._uploader.uploadFiles(notUploadedFiles, this._params.uploads.route, uploadParams);
        } catch (error) {
            console.error('Bulk upload failed:', error);
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

        const fileKey = this._getFileKey(file);

        // Убедимся, что файл в списке ожидания
        if (!this._pendingUploadedKeys.has(fileKey)) {
            this._pendingUploadedKeys.add(fileKey);
            this._setStatItem('pending', this._pendingUploadedKeys.size);
        }

        // Убираем из unUploadedFiles, если был там
        this._unUploadedFiles = this._unUploadedFiles.filter(f => this._getFileKey(f) !== fileKey);

        // Обновляем UI: устанавливаем состояние "loading"
        const $item = this._getItemElement(file);
        if ($item) {
            Classes.remove($item, CLASS_NAME_FAILING);
            Classes.add($item, CLASS_NAME_LOADING);
            Classes.add($item, CLASS_NAME_PENDING);
        }

        // Настройка событий загрузки
        this._setupUploadEventHandlers(file);

        const uploadParams = {
            additionalData: {
                timestamp: new Date().toISOString(),
                source: 'web_uploader'
            }
        };

        try {
            await this._uploader.uploadFiles([file], this._params.uploads.route, uploadParams);
        } catch (error) {
            console.error('Upload failed:', error);
            // Ошибка будет обработана через onError callback
        }
    }

    _setupUploadEventHandlers() {
        if (typeof this._uploader.offAll === 'function') {
            this._uploader.offAll();
        } else {
            this._uploader.off('progress');
            this._uploader.off('complete');
            this._uploader.off('error');
            this._uploader.off('allComplete');
        }

        this._updateStat(true)

        this._uploader.onProgress((uploadData) => {
            const file = uploadData.file;
            const $item = this._getItemElement(file);
            if (!$item) return;

            Classes.add($item, CLASS_NAME_LOADING);
            Classes.add($item, CLASS_NAME_PENDING);

            const button = this._getButtonElement(file);
            if (isElement(button)) {
                const li = button.closest('li');
                if (li) {
                    const fileRemove = Selectors.find('.file-remove', li);
                    if (fileRemove) {
                        fileRemove.innerHTML = '';
                        fileRemove.appendChild(this._setButtonElement(file, true));
                    }
                }
            }

            this._triggerCallback('onUploadProgress', {
                file: uploadData.file,
                progress: uploadData.progress,
                bytesSent: uploadData.bytesSent,
                totalBytes: uploadData.totalBytes
            });
        });

        this._uploader.onComplete((uploadData) => {
            const file = uploadData.file;
            const fileKey = this._getFileKey(file);
            const $item = this._getItemElement(file);

            if (!$item) return;

            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_LOADED);
            Classes.remove($item, CLASS_NAME_PENDING);

            const button = this._getButtonElement(file);
            const id = normalizeData(uploadData.result?.response?.id) || uploadData.id || file.lastModified;
            file.id = id;

            if (isElement(button) && id) {
                const li = button.closest('li');
                if (li) {
                    Manipulator.set(li, 'data-id', id);
                    this._setButtonElement(file);

                    const fileRemove = Selectors.find('.file-remove', li);
                    if (fileRemove) {
                        fileRemove.innerHTML = '';
                        fileRemove.appendChild(this._setButtonElement(file, true, 'completed'));
                        Classes.add(li, CLASS_NAME_COMPLETED);

                        setTimeout(() => {
                            fileRemove.innerHTML = '';
                            fileRemove.appendChild(this._setButtonElement(file));
                            Classes.remove(li, CLASS_NAME_COMPLETED);
                        }, 1000);
                    }
                }
            }

            this._uploadedKeys.add(fileKey);
            this._failingUploadedKeys.delete(fileKey);
            this._pendingUploadedKeys.delete(fileKey);

            this._setStatItem('completed', this._uploadedKeys.size);
            this._setStatItem('pending', this._pendingUploadedKeys.size);

            this._triggerCallback('onUploadComplete', {
                file: uploadData.file,
                response: uploadData.result?.response,
                status: uploadData.result?.status,
                id: file.id
            });
        });

        this._uploader.onError((uploadData) => {
            const file = uploadData.file;
            const fileKey = this._getFileKey(file);
            const $item = this._getItemElement(file);

            if (!$item) return;

            this._uploadedKeys.delete(fileKey);
            this._failingUploadedKeys.add(fileKey);
            this._pendingUploadedKeys.delete(fileKey);
            this._unUploadedFiles.push(file);

            Classes.remove($item, CLASS_NAME_PENDING);
            Classes.replace($item, CLASS_NAME_LOADING, CLASS_NAME_FAILING);

            this._setStatItem('failing', this._failingUploadedKeys.size);
            this._setStatItem('pending', this._pendingUploadedKeys.size);

            const button = this._getButtonElement(file);
            if (isElement(button)) {
                const li = button.closest('li');
                if (li) {
                    this._setButtonElement(file);

                    const fileRemove = Selectors.find('.file-remove', li);
                    if (fileRemove) {
                        fileRemove.innerHTML = '';
                        fileRemove.appendChild(this._setButtonElement(file, true, 'failing'));
                        Classes.add(li, CLASS_NAME_FAILING);
                    }
                }
            }
        });

        this._uploader.onAllComplete(() => {
            EventHandler.trigger(this._element, `${NAME_KEY}.upload.allComplete`);
            this._updateStat(false);

            if (!this._failingUploadedKeys.size) {
                if (this._params.sortable?.enabled && this._params.sortable.route) {
                    import('./sortable.js').then(module => {
                        if (this._sortable && typeof this._sortable.destroy === 'function') {
                            this._sortable.destroy();
                        }

                        this._sortable = new module.default(this, this._params.sortable);
                    }).catch(err => {
                        console.error('Ошибка загрузки VGFilesSortable:', err);
                    });
                }
            }

            this._triggerCallback('onUploadAllComplete', {
                uploaded: this._uploadedKeys.size,
                failed: this._failingUploadedKeys.size,
                total: this._files.length
            });
        });
    }

    reload(button) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        const dataButton = Manipulator.get(button, 'data');
        const fileData = {
            name: dataButton.name,
            size: dataButton.size,
            type: dataButton.type,
            lastModified: dataButton['last-modified']
        };

        const fileKey = this._getFileKey(fileData);
        if (!this._failingUploadedKeys.has(fileKey)) return;

        const fileToRetry = this._unUploadedFiles.find(f => this._getFileKey(f) === fileKey);
        if (!fileToRetry) return;

        this._failingUploadedKeys.delete(fileKey);
        this._pendingUploadedKeys.add(fileKey);

        this._setStatItem('failing', this._failingUploadedKeys.size);
        this._setStatItem('pending', this._pendingUploadedKeys.size);

        this._triggerCallback('onReload', {
            button: button,
            file: fileToRetry
        });

        this.upload(fileToRetry);
    }

    removeFile(button) {
        const name = normalizeData(Manipulator.get(button, 'data-name'));
        const size = normalizeData(Manipulator.get(button, 'data-size'));
        const id = normalizeData(Manipulator.get(button, 'data-id'));

        const fileToRemove = this._files.find(f => f.name === name && f.size === size);
        if (fileToRemove) {
            const key = this._getFileKey(fileToRemove);
            this._uploadedKeys.delete(key);
            this._pendingUploadedKeys.delete(key);
            this._failingUploadedKeys.delete(key);
        }

        this._getItemElement().forEach(el => {
            const btn = Selectors.find('button', el);
            if (!btn) return;
            const btnId = normalizeData(Manipulator.get(btn, 'data-id'));
            const btnName = normalizeData(Manipulator.get(btn, 'data-name'));
            const btnSize = normalizeData(Manipulator.get(btn, 'data-size'));

            this._files.forEach(file => {
                if (file.name === btnName && file.size === btnSize) {
                    file.id = btnId;
                }
            });

            if (fileToRemove?.name === btnName && fileToRemove?.size === btnSize) {
                fileToRemove.id = btnId;
            }
        });

        if (this._params.ajax && this._params.removes.single.route) {
            if (!id) return;

            const route = this._params.removes.single.route + '/' + encodeURIComponent(id);
            const paramsAjax = {
                route: route,
                method: 'delete'
            };

            const _completeRemoveFile = (data) => {
                this._files = this._files.filter(f => !(f.name === name && f.size === size));
                this._updateStatsAfterRemove();

                if (this._files.length) {
                    this._renderUI(this._files);
                } else {
                    this.clear(true, true);
                }

                if (this._params.removes.single.toast) {
                    VGToast.run(data?.response?.message);
                }
            };

            if (this._params.removes.single.alert) {
                VGAlert.confirm(button, {
                    lang: this._params.lang,
                    ajax: paramsAjax,
                    buttons: {
                        agree: {
                            text: lang_buttons(this._params.lang, NAME)['agree'],
                            class: ["btn-danger"],
                        },
                        cancel: {
                            text: lang_buttons(this._params.lang, NAME)['cancel'],
                            class: ["btn-outline-danger"],
                        },
                    },
                    message: {
                        title: lang_messages(this._params.lang, NAME)['title'],
                        description: lang_messages(this._params.lang, NAME)['description']
                    }
                });

                EventHandler.one(button, 'vg.alert.accept', (event) => {
                    _completeRemoveFile(event.vgalert.data);
                });
            } else {
                this._params.ajax = paramsAjax;
                this._route((status, data) => {
                    _completeRemoveFile(data);
                });
            }
        } else {
            this._files = this._files.filter(f => !(f.name === name && f.size === size));
            this._updateStatsAfterRemove();
            this._files.length ? this.build() : this.clear(true);
        }

        this._resetFileInput();

        this._triggerCallback('onRemoveFile', {
            button: button,
            name: name,
            size: size,
            id: id,
            remaining: this._files.length
        });
    }

    _updateStatsAfterRemove() {
        this._setStatItem('completed', this._uploadedKeys.size);
        this._setStatItem('pending', this._pendingUploadedKeys.size);
        this._setStatItem('failing', this._failingUploadedKeys.size);
        this._updateStat();
    }

    _getItemElement(file = null) {
        let className = `${this._getClass('info-list')}`;
        if (this._nodes.drop) className = `${this._getClass('drop-list')}`;

        if (!file) {
            return Selectors.findAll(
                `.${className} li.loaded`,
                this._element
            )
        } else {
            return Selectors.find(
                `.${className} li[data-name="${file.name}"][data-size="${file.size}"]`,
                this._element
            );
        }
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
        if (!this._nodes.stat) return;

        const $progress = Selectors.find(`.${CLASS_NAME_STAT}-progress`, this._nodes.stat);
        if (!$progress) return;

        let $statList = Selectors.find(`.${CLASS_NAME_STAT}-progress-list`, $progress);
        if (!$statList) {
            $statList = this._tpl.ul([
                this._tpl.li({
                    class: 'stat-item pending',
                    'data-count': '0',
                    'title': lang_messages(this._params.lang, NAME)['pending']
                }, [
                    this._tpl.span({ class: 'stat-label' }, getSVG('cloud-dot'), { isHTML: true }),
                    this._tpl.span({ class: 'stat-value' }, 0),
                ]),
                this._tpl.li({
                    class: 'stat-item completed',
                    'data-count': '0',
                    'title': lang_messages(this._params.lang, NAME)['completed']
                }, [
                    this._tpl.span({ class: 'stat-label' }, getSVG('cloud-dot'), { isHTML: true }),
                    this._tpl.span({ class: 'stat-value' }, 0),
                ]),
                this._tpl.li({
                    class: 'stat-item failing',
                    'data-count': '0',
                    'title': lang_messages(this._params.lang, NAME)['failing']
                }, [
                    this._tpl.span({ class: 'stat-label' }, getSVG('cloud-dot'), { isHTML: true }),
                    this._tpl.span({ class: 'stat-value' }, 0),
                ])

            ], { class: CLASS_NAME_STAT + '-progress-list' }, true);
            $progress.appendChild($statList);
        }
    }

    _setStatItem(status, count) {
        if (!this._nodes.stat) return;

        const $item = Selectors.find(`.${CLASS_NAME_STAT}-progress-list li.${status}`, this._nodes.stat);
        if (!$item) return;

        Manipulator.set($item, 'data-count', count);
        const $value = Selectors.find('.stat-value', $item);
        if ($value) $value.innerHTML = count;
    }

    _renderUIStatusDropInfoAjax(files) {
        if (!this._params.ajax) return;

        files.forEach(file => {
            const $item = this._getItemElement(file);
            if (!$item) return;

            const key = this._getFileKey(file);
            if (this._uploadedKeys.has(key)) {
                Classes.replace($item, CLASS_NAME_PENDING, CLASS_NAME_COMPLETED);
                Classes.add($item, CLASS_NAME_LOADED);
            } else if (this._failingUploadedKeys.has(key)) {
                Classes.replace($item, CLASS_NAME_PENDING, CLASS_NAME_FAILING);
            } else {
                Classes.add($item, CLASS_NAME_PENDING);
            }
        });
    }

    _triggerCallback(name, data) {
        const cb = this._params.callbacks?.[name];
        if (typeof cb === 'function') {
            try { cb.call(this, data, this); } catch (e) { console.error(`${name} callback error:`, e); }
        }
    }

    _getUploadedIds() {
        return Array.from(this._uploadedKeys).map(key => {
            const file = this._files.find(f => this._getFileKey(f) === key);
            return file?.id || null;
        }).filter(id => id !== null);
    }

    dispose() {
        if (this._sortable && typeof this._sortable.destroy === 'function') {
            this._sortable.destroy();
        }
        this._sortable = null;

        this.clear();
        if (this._uploader) this._uploader.destroy();
        super.dispose();
    }
}

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
    if (!target) return;

    const instance = VGFiles.getOrCreateInstance(target);

    if (instance._params.ajax && instance._params.removes.all.route) {
        e.preventDefault();

        const route = instance._params.removes.all.route;
        const paramsAjax = {
            route: route,
            method: 'post',
            data: { ids: instance._getUploadedIds() }
        };

        const _completeClearAll = () => {
            instance.clear(true, true);
        };

        if (instance._params.removes.all.alert) {
            VGAlert.confirm(e.target, {
                lang: instance._params.lang,
                ajax: paramsAjax,
                buttons: {
                    agree: {
                        text: lang_buttons(instance._params.lang, NAME)['agree'],
                        class: ["btn-danger"],
                    },
                    cancel: {
                        text: lang_buttons(instance._params.lang, NAME)['cancel'],
                        class: ["btn-outline-danger"],
                    },
                },
                message: {
                    title: lang_messages(instance._params.lang, NAME)['title'],
                    description: lang_messages(instance._params.lang, NAME)['descriptions']
                }
            });

            EventHandler.one(e.target, 'vg.alert.accept', (event) => {
                if (instance._params.removes.all.toast) {
                    VGToast.run(event.vgalert.data?.response?.message);
                }
                _completeClearAll();
            });
        } else {
            instance._route(paramsAjax, (status, data) => {
                if (instance._params.removes.all.toast && data?.response?.message) {
                    VGToast.run(data.response.message);
                }
                _completeClearAll();
            });
        }
    } else {
        instance.clear(true, true);
    }
});

export default VGFiles;