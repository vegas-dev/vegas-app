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
import VGFilesSortable from "./sortable";

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
            init: true,
            allowed: false,
            lang: document.documentElement.lang || 'ru',
            limits: { count: 0, sizes: 10, total: 0 },
            image: false,
            detach: true,
            info: true,
            types: [],
            ajax: false,
            prepend: true,
            replace: true,
            rename: false,
            smartdrop: false,
            uploads: {
                mode: 'sequential',
                route: '',
                maxParallel: 3,
                maxConcurrent: 1,
                retryAttempts: 1,
                retryDelay: 1000,
            },
            removes: {
                all: { route: '', alert: true, toast: true, confirm: null },
                single: { route: '', alert: true, toast: true, confirm: null }
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
        this._render = null;

        this.isRenderNonInit = false;
        this._initExtended();
    }

    static get NAME() { return NAME; }
    static get NAME_KEY() { return NAME_KEY; }

    _initExtended() {
        if (!this._isInitialized) return;

        this._render = new VGFilesTemplateRender(this, this._element, this._params);

        if (this._params.ajax) {
            this._params.allowed = false;
        }

        if (this.isRenderNonInit) return;
        this.isRenderNonInit = this._render.init();

        const parsedFiles = this._render.parsedFiles;

        if (parsedFiles.length) {
            this._addExternalFiles(parsedFiles);
        }

        if (this._params.allowed && !this._params.ajax) this._params.detach = false;
        if (this._nodes.drop) {
            this._params.image = true;
            this._params.detach = true;
            this._setDropActiveText();

            VGFilesDroppable.getOrCreateInstance(this._nodes.drop, this._params).init();
        }

        this._addEventListenerExtended();
        this._renderStat();
        this._triggerCallback('onInit', { element: this._element, files: parsedFiles || [] });
    }

    _setDropActiveText() {
        if (!this._nodes.drop) return;

        const messages = lang_messages(this._params.lang, NAME) || {};
        const activeText = (this._nodes.drop.getAttribute('data-drop-active-text') || '').trim() || messages['drop-active'] || 'Release to upload';
        this._nodes.drop.setAttribute('data-drop-active-text', activeText);

        const title = Selectors.find('.vg-files-drop-message .title', this._nodes.drop);
        if (!title) return;

        const originalText = (title.getAttribute('data-drop-original-text') || '').trim() || (title.textContent || '').trim();
        title.setAttribute('data-drop-original-text', originalText);
    }

    _addExternalFiles(files) {
        if (!Array.isArray(files) || !files.length) return;

        files.forEach(fileData => {
            if (!fileData?.name) return;

            const fileOptions = {};
            if (typeof fileData.type === 'string') fileOptions.type = fileData.type;
            if (Number.isFinite(fileData.lastModified)) fileOptions.lastModified = fileData.lastModified;

            const file = new File([""], fileData.name, fileOptions);

            if (fileData.id !== undefined && fileData.id !== null && fileData.id !== '') {
                Object.defineProperty(file, 'id', {
                    value: fileData.id,
                    writable: true,
                    enumerable: true
                });
            }

            if (Number.isFinite(fileData.size)) {
                Object.defineProperty(file, 'size', {
                    value: fileData.size,
                    writable: true,
                    enumerable: true
                });
            }

            if (fileData.src !== undefined && fileData.src !== null && fileData.src !== '') {
                Object.defineProperty(file, 'src', {
                    value: fileData.src,
                    writable: true,
                    enumerable: true
                });
            }

            if (fileData.image !== undefined && fileData.image !== null && fileData.image !== '') {
                Object.defineProperty(file, 'image', {
                    value: fileData.image,
                    writable: true,
                    enumerable: true
                });
            }

            if (fileData.customData && typeof fileData.customData === 'object' && !Array.isArray(fileData.customData)) {
                Object.defineProperty(file, 'customData', {
                    value: fileData.customData,
                    writable: true,
                    enumerable: true
                });
            }

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
            this._sortable = new VGFilesSortable(this, this._params.sortable)
        }

        // Триггерим изменение
        this._triggerCallback('onChange', { files: this._files });
        EventHandler.trigger(this._element, `${NAME_KEY}.change`, { files: this._files });
    }

    _addEventListenerExtended() {
        Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
            if (this._onNativeInputChange) {
                el.removeEventListener('change', this._onNativeInputChange);
            }

            el.addEventListener('change', (e) => this._handleChange(e));
        });
    }

    _handleChange(e) {
        const input = e?.target;
        const inputFiles = this._snapshotInputFiles(input);
        this.change(input);

        if (this._params.ajax) this.uploadAll(this._files);

        const payload = {
            files: this._files,
            input: e?.target || e?.src || '',
            inputFiles
        };

        this._triggerCallback('onChange', payload);
        this._triggerEvent('change', {
            files: this._files,
            input: payload.input,
            inputFiles: payload.inputFiles
        });
    }

    _snapshotInputFiles(input) {
        const files = input?.files;
        if (!files?.length) return [];
        return Array.from(files);
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
        this._triggerEvent('upload.start', {
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

            const payload = {
                file: uploadData.file,
                progress: uploadData.progress,
                bytesSent: uploadData.bytesSent,
                totalBytes: uploadData.totalBytes
            };

            this._triggerCallback('onUploadProgress', payload);
            this._triggerEvent('upload.progress', payload);
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

            const payload = {
                file: uploadData.file,
                response: uploadData.result?.response,
                status: uploadData.result?.status,
                id: file.id
            };

            this._triggerCallback('onUploadComplete', payload);
            this._triggerEvent('upload.complete', payload);
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

            const payload = { file: uploadData.file };

            this._triggerCallback('onUploadError', payload);
            this._triggerEvent('upload.error', payload);
        });

        this._uploader.onAllComplete(() => {
            this._triggerEvent('upload.allComplete');
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

            const payload = {
                uploaded: this._uploadedKeys.size,
                failed: this._failingUploadedKeys.size,
                total: this._files.length
            };

            this._triggerCallback('onUploadAllComplete', payload);
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

        const payload = {
            button: button,
            file: fileToRetry
        };

        this._triggerCallback('onReload', payload);
        this._triggerEvent('reload', payload);

        this.upload(fileToRetry);
    }

    _runAjaxRequest(paramsAjax, callback) {
        const previousAjax = this._params.ajax;
        this._params.ajax = paramsAjax;

        this._route((status, data) => {
            this._params.ajax = previousAjax;
            callback(status, data);
        });
    }

    _normalizeConfirmResult(result) {
        if (result === true) return { accepted: true, data: null };
        if (result === false || result == null) return { accepted: false, data: null };

        if (typeof result === 'object') {
            if (typeof result.accepted === 'boolean') {
                return { accepted: result.accepted, data: result.data ?? null };
            }
            if (Object.prototype.hasOwnProperty.call(result, 'data')) {
                return { accepted: true, data: result.data ?? null };
            }
        }

        return { accepted: Boolean(result), data: null };
    }

    _runDefaultRemoveConfirm(trigger, params) {
        return new Promise((resolve) => {
            VGAlert.confirm(trigger, {
                lang: params.lang,
                ajax: params.ajax,
                buttons: params.buttons,
                message: params.message
            });

            EventHandler.one(trigger, 'vg.alert.accept', (event) => {
                resolve({ accepted: true, data: event?.vgalert?.data ?? null });
            });

            EventHandler.one(trigger, 'vg.alert.reject', () => {
                resolve({ accepted: false, data: null });
            });
        });
    }

    _confirmRemove(type, trigger, ajax, message) {
        const buttons = {
            agree: {
                text: lang_buttons(this._params.lang, NAME)['agree'],
                class: ["btn-danger"],
            },
            cancel: {
                text: lang_buttons(this._params.lang, NAME)['cancel'],
                class: ["btn-outline-danger"],
            },
        };

        const confirmParams = {
            type,
            trigger,
            lang: this._params.lang,
            ajax,
            buttons,
            message
        };

        const customConfirm = this._params?.removes?.[type]?.confirm;
        if (typeof customConfirm === 'function') {
            return Promise.resolve(customConfirm(confirmParams, this))
                .then((result) => this._normalizeConfirmResult(result));
        }

        return this._runDefaultRemoveConfirm(trigger, confirmParams);
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

            const routeBase = this._params.removes.single.route;
            const routeSeparator = routeBase.includes('?') ? '&' : '?';
            const route = `${routeBase}${routeSeparator}id=${encodeURIComponent(id)}`;
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
                const message = {
                    title: lang_messages(this._params.lang, NAME)['title'],
                    description: lang_messages(this._params.lang, NAME)['description']
                };

                this._confirmRemove('single', button, paramsAjax, message)
                    .then((result) => {
                        if (!result.accepted) return;

                        if (result.data) {
                            _completeRemoveFile(result.data);
                            return;
                        }

                        this._runAjaxRequest(paramsAjax, (status, data) => {
                            _completeRemoveFile(data);
                        });
                    })
                    .catch(() => {});
            } else {
                this._runAjaxRequest(paramsAjax, (status, data) => {
                    _completeRemoveFile(data);
                });
            }
        } else {
            this._files = this._files.filter(f => !(f.name === name && f.size === size));
            this._updateStatsAfterRemove();
            this._files.length ? this.build() : this.clear(true);
        }

        this._resetFileInput();

        const payload = {
            button: button,
            name: name,
            size: size,
            id: id,
            remaining: this._files.length
        };

        this._triggerCallback('onRemoveFile', payload);
        this._triggerEvent('remove', payload);
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
        ], 'button', this._buildFileDataAttributes(file, {
            type: 'button',
            [action]: 'file',
            'data-name': file.name,
            'data-size': file.size ?? 0,
            'data-type': file.type || '',
            'data-last-modified': file.lastModified || '',
            'data-id': file.id || ''
        }));
    }

    _renderStat() {
        if (!this._nodes.stat) return;
        if (!this._params.ajax) return;

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

    _triggerEvent(suffix, payload = {}) {
        EventHandler.trigger(this._element, `${NAME_KEY}.${suffix}`, payload);
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
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (target) VGFiles.getOrCreateInstance(target).removeFile(e.target.closest(SELECTOR_DATA_DISMISS));
});

EventHandler.on(document, `click.${NAME_KEY}.data.api`, SELECTOR_DATA_RELOAD, function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

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
            const message = {
                title: lang_messages(instance._params.lang, NAME)['title'],
                description: lang_messages(instance._params.lang, NAME)['descriptions']
            };

            instance._confirmRemove('all', e.target, paramsAjax, message)
                .then((result) => {
                    if (!result.accepted) return;

                    if (result.data) {
                        if (instance._params.removes.all.toast) {
                            VGToast.run(result.data?.response?.message);
                        }
                        _completeClearAll();
                        return;
                    }

                    instance._runAjaxRequest(paramsAjax, (status, data) => {
                        if (instance._params.removes.all.toast && data?.response?.message) {
                            VGToast.run(data.response.message);
                        }
                        _completeClearAll();
                    });
                })
                .catch(() => {});
        } else {
            instance._runAjaxRequest(paramsAjax, (status, data) => {
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
