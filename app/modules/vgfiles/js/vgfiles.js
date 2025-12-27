import BaseModule from "../../base-module";
import {isElement, mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import Html from "../../../utils/js/components/templater";
import {lang_buttons, lang_messages} from "../../../utils/js/components/lang";
import {getSVG} from "../../module-fn";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { Manipulator, Classes } from "../../../utils/js/dom/manipulator";
import FileUploader from "./loader";
import DnD from "./dnd";
import VGAlert from "../../vgalert";
import VGToast from "../../vgtoast";

/**
 * Constants
 */
const NAME = 'files';
const NAME_KEY = 'vg.files';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="files"]';
const SELECTOR_DATA_RELOAD = '[data-vg-reload="file"]';
const SELECTOR_DATA_DISMISS = '[data-vg-dismiss="file"]';
const SELECTOR_DATA_DISMISS_ALL = '[data-vg-dismiss="vg-files"]';
const SELECTOR_DATA_FAKE = '[data-vg-files="generated"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_STAT = `${CLASS_NAME_CONTAINER}-stat`;
const CLASS_NAME_INFO = `${CLASS_NAME_CONTAINER}-info`;
const CLASS_NAME_INFO_LIST = `${CLASS_NAME_INFO}--list`;
const CLASS_NAME_DROP = `${CLASS_NAME_CONTAINER}-drop`;
const CLASS_NAME_DROP_LIST = `${CLASS_NAME_CONTAINER}-drop--list`;
const CLASS_NAME_ERRORS = `${CLASS_NAME_CONTAINER}-errors`;
const CLASS_NAME_PENDING  = 'pending';
const CLASS_NAME_LOADING = 'loading';
const CLASS_NAME_LOADED = 'loaded';
const CLASS_NAME_FAILING = 'failing';
const CLASS_NAME_COMPLETED = 'completed';

const EVENT_KEY_CHANGE = `${NAME_KEY}.change`;

const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_DISMISS_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_RELOAD_DATA_API = `click.${NAME_KEY}.data.api`;

class VGFiles extends BaseModule {
    constructor(element, params = {}) {
        super(element, params);

        this._params = this._getParams(this._element, mergeDeepObject({
            allowed: false,
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
                retryAttempts: 1, // Повтор неудачных отправок
                retryDelay: 1000, // Задержка при повторной отправке
            },
            removes: {
               all: {
                   route: '',
                   alert: true,
                   toast: true
               },
               single: {
                   route: '',
                   alert: true,
                   toast: true
               }
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
        this._failingUploadedKeys = new Set();
        this._pendingUploadedKeys = new Set();
        this._unUploadedFiles = [];
        this._uploader = null;

        this._nodes = {
            stat: Selectors.find(`.${CLASS_NAME_STAT}`, this._element),
            info: Selectors.find(`.${CLASS_NAME_INFO}`, this._element),
            infoList: Selectors.find(`.${CLASS_NAME_INFO_LIST}`, this._element),
            drop: Selectors.find(`.${CLASS_NAME_DROP}`, this._element),
            dropList: Selectors.find(`.${CLASS_NAME_DROP_LIST}`, this._element),
            dropMessage: Selectors.find(`.${CLASS_NAME_DROP}-message`, this._element),
        };

        if (this._params.ajax) {
            this._params.allowed = false;
        }

        if (this._params.allowed && !this._params.ajax) {
            this._params.detach = false;
        }

        if (this._nodes.drop) {
            this._params.image = true;
            this._params.detach = true;
        }

        this._init();
        this._addEventListener();

        // Вызов колбека инициализации
        this._triggerCallback('onInit', { element: this._element });
    }

    static get NAME() { return NAME; }
    static get NAME_KEY() { return NAME_KEY; }

    /**
     * Инициализация компонента
     */
    _init() {
        this._preventOriginalInputFromSubmit();
        if (this._nodes.drop) {
            new DnD(this._nodes.drop, this._params).init();
        }
    }

    /**
     * Полная перестройка интерфейса
     */
    build() {
        this._updateStat();
        this.change();
    }

    /**
     * Обработка изменения файлов (через input или DnD)
     */
    change(input = null) {
        const incomingFiles = input?.files || this._files;
        if (!incomingFiles.length || (input?.files && input.files.length === 0)) return;

        if (!this._params.ajax) this.clear();

        this._cleanupErrors();
        const processedFiles = this.append(incomingFiles);

        if (processedFiles.length) {
            this._updateStat();

            if (this._params.ajax) {
                this.uploadAll(processedFiles);
            } else {
                this._generateHiddenInputs(processedFiles);
                this._renderUI(processedFiles);

                if (this._params.allowed) {
                    this._cleanupFakeInputs(this._params.allowed);
                    this._cleanupErrors();
                    this._files = [];
                }
            }
        }

        EventHandler.trigger(this._element, EVENT_KEY_CHANGE, { files: processedFiles });

        // Вызов колбека изменения
        this._triggerCallback('onChange', {
            files: processedFiles,
            input: input
        });
    }

    /**
     * Асинхронная загрузка всех файлов
     */
    async uploadAll(files) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        // Очищаем состояние ошибок при новом цикле загрузки
        if (!this._uploadedKeys.size) {
            this._failingUploadedKeys.clear();
        }

        // Фильтруем только те файлы, которые ещё не были загружены
        const notUploadedFiles = files.filter(f => !this._uploadedKeys.has(this._getFileKey(f)));
        if (!notUploadedFiles.length) return;

        // Инициализация uploader'а
        if (!this._uploader || this._uploader.isIdle()) {
            this._uploader = new FileUploader({
                mode: this._params.uploads.mode,
                maxConcurrent: this._params.uploads.maxConcurrent,
                maxParallel: this._params.uploads.maxParallel,
                retryAttempts: this._params.uploads.retryAttempts,
                retryDelay: this._params.uploads.retryDelay
            });

            // Настройка обработчиков событий один раз
            this._setupUploadEventHandlers();
        }

        // Добавляем файлы в очередь ожидания
        notUploadedFiles.forEach(file => {
            const fileKey = this._getFileKey(file);
            this._pendingUploadedKeys.add(fileKey);
            this._unUploadedFiles = this._unUploadedFiles.filter(f => this._getFileKey(f) !== fileKey);
        });

        this._setStatItem('pending', this._pendingUploadedKeys.size);
        this._renderUI(this._files);

        const uploadParams = {
            additionalData: {
                timestamp: new Date().toISOString(),
                source: 'web_uploader'
            }
        };

        // Вызов колбека начала загрузки
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

    /**
     * Асинхронная загрузка файла
     */
    async upload(file) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        // Создаем uploader только если его ещё нет или предыдущий завершил работу
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

    /**
     * Вспомогательный метод: настройка обработчиков событий загрузки
     */
    _setupUploadEventHandlers() {
        // Очищаем старые обработчики, если нужно
        if (typeof this._uploader.offAll === 'function') {
            this._uploader.offAll();
        } else {
            // Ручная отвязка всех возможных событий, если offAll недоступен
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

            // Вызов колбека прогресса загрузки
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

            // Вызов колбека завершения загрузки файла
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
        });

        this._uploader.onAllComplete(() => {
            EventHandler.trigger(this._element, `${NAME_KEY}.upload.allComplete`);
            this._updateStat(false)

            // Вызов колбека завершения всех загрузок
            this._triggerCallback('onUploadAllComplete', {
                uploaded: this._uploadedKeys.size,
                failed: this._failingUploadedKeys.size,
                total: this._files.length
            });
        });
    }

    /**
     * Метод для повторной загрузки файла
     */
    reload(button) {
        if (!this._params.ajax || !this._params.uploads.route) return;

        const dataButton = Manipulator.get(button, 'data');
        const fileData = {
            name: dataButton.name,
            size: dataButton.size,
            type: dataButton.type,
            lastModified: dataButton['last-modified']
        };

        // Проверяем, что файл действительно находится в списке неудачных
        const fileKey = this._getFileKey(fileData);
        if (!this._failingUploadedKeys.has(fileKey)) return;

        // Ищем оригинальный File объект в списке незагруженных
        const fileToRetry = this._unUploadedFiles.find(f => this._getFileKey(f) === fileKey);
        if (!fileToRetry) return;

        // Убираем из failing, добавляем в pending
        this._failingUploadedKeys.delete(fileKey);
        this._pendingUploadedKeys.add(fileKey);

        // Обновляем статистику
        this._setStatItem('failing', this._failingUploadedKeys.size);
        this._setStatItem('pending', this._pendingUploadedKeys.size);

        // Вызов колбека повторной загрузки
        this._triggerCallback('onReload', {
            button: button,
            file: fileToRetry
        });

        // Запускаем повторную загрузку
        this.upload(fileToRetry);
    }

    /**
     * Получение элемента файла по данным
     */
    _getItemElement(file = null) {
        let className = CLASS_NAME_INFO_LIST;
        if (this._nodes.drop) className = CLASS_NAME_DROP;

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

    /**
     * Получение кнопки файла
     */
    _getButtonElement(file) {
        if (typeof file === 'string') {
            return Selectors.find(file, this._element);
        }
        return Selectors.find(`button[data-name="${file.name}"][data-size="${file.size}"]`, this._element);
    }

    /**
     * Создание кнопки удаления
     */
    _setButtonElement(file, isAjax = false, status = '') {
        let icon = getSVG('trash'),
            action = 'data-vg-dismiss';
        if (!this._params.info) icon = getSVG('cross');
        if (isAjax) {
            icon = getSVG('spinner');

            if (status === 'completed') {
                icon = getSVG('check');
            } else {
                action = 'data-vg-reload';
            }
        }


        return this._tpl.button([
            this._tpl.i({}, icon, { isHTML: true }),
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

    /**
     * Обновление UI: отображение файлов списком
     */
    _renderUI(files) {
        if(this._nodes.drop) {
            this._renderUIDrop(files);
        } else {
            if (!this._nodes.info) return;

            Classes.add(this._nodes.info, 'show');
            this._renderInfoList(files);

            if (this._params.ajax) {
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
        }
    }

    /**
     * Обновление UI: отображение файлов в дроп зоне
     */
    _renderUIDrop(files) {
        if (!this._nodes.drop) return;
        Classes.remove(this._nodes.dropMessage, 'show');
        Classes.add(this._nodes.drop, 'active');
        this._renderUIDropList(files);
    }

    _renderUIDropList(files, isAjax = false) {
        let $list = Selectors.find(`.${CLASS_NAME_DROP_LIST}`, this._nodes.drop);
        if (!$list) {
            $list = this._tpl.ul([], { class: CLASS_NAME_DROP_LIST });
        }

        const fragment = document.createDocumentFragment();
        files.forEach((file) => {
            let classes = [];

            if (this._params.detach) {
                classes.push('with-remove')
            }

            if (this._params.limits.count === 1) {
                classes.push('single');

                if (file.type.startsWith('image/')) {
                    classes.push('single-image')
                } else {
                    classes.push('single-file')
                }
            }

            const $li = this._tpl.li(
                { 'data-name': file.name, 'data-size': file.size, 'data-id': file.id || '', class: 'file ' + classes.join(' ') },
                []
            );

            // Добавляем превью изображения, если включено и файл — картинка
            this._renderUIImages(file, $li);

            // Добавляем кнопку удаления, если разрешено
            if (this._params.detach) {
                const $fileRemove = this._tpl.div({ class: 'file-remove' }, [
                    this._setButtonElement(file, isAjax)
                ])
                $li.appendChild($fileRemove);
            }

            fragment.appendChild($li);
        });

        $list.innerHTML = '';
        $list.appendChild(fragment);

        this._nodes.drop.appendChild($list);
    }

    /**
     * Обновление счётчика файлов и общего размера
     */
    _updateStat(isLoad = false) {
        if (!this._nodes.stat) return;

        Classes.add(this._nodes.stat, 'show');

        const $reset = Selectors.find(SELECTOR_DATA_DISMISS_ALL, this._nodes.stat);
        if ($reset) {
            if (isLoad) {
                Manipulator.set($reset, 'disabled', 'disabled');
            } else {
                Manipulator.remove($reset, 'disabled');
            }
        }

        const totalSize = this._getSizes(this._files, true);

        const $count = Selectors.find(`.${CLASS_NAME_STAT}-count`, this._nodes.stat);
        if (!$count) return;
        $count.innerHTML = this._files.length
            ? `${this._files.length}<span>[${totalSize}]</span>`
            : '';

        if (this._params.ajax) {
            this._renderStat();
        }
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
            ], { class: CLASS_NAME_STAT + '-progress-list' });
            $progress.appendChild($statList);
        }
    }

    _getStatItem(status) {
        if (this._nodes.stat) {
            return Selectors.find(`.${CLASS_NAME_STAT}-progress-list li.${status}`, this._nodes.stat);
        }
    }

    _setStatItem(status, count) {
        const $item = this._getStatItem(status);
        if (!$item) return;
        Manipulator.set($item, 'data-count', count);

        const $statValue = Selectors.find(`.${CLASS_NAME_STAT}-progress-list li.${status} .stat-value`, this._nodes.stat);
        if ($statValue) {
            $statValue.innerHTML = count;
        }
    }

    /**
     * Отображение списка файлов
     */
    _renderInfoList(files, isAjax) {
        if (!this._nodes.info) return;

        Classes.add(this._nodes.info, 'show')

        let $list = Selectors.find(`.${CLASS_NAME_INFO_LIST}`, this._element);
        if (!$list) {
            $list = this._tpl.ul([], { class: CLASS_NAME_INFO_LIST });
            this._nodes.info.append($list);
        }

        if (!this._params.info) Classes.add($list, 'list-row')

        const fragment = document.createDocumentFragment();
        files.forEach((file, i) => {
            let classes = [];

            if (this._params.image) {
                classes.push('with-image');
            }
            if (this._params.info) {
                classes.push('with-info');
            }
            if (this._params.detach) {
                classes.push('with-remove')
            }

            const $li = this._tpl.li(
                { 'data-name': file.name, 'data-size': file.size, 'data-id': file.id || '', class: 'file ' + classes.join(' ') },
                []
            );

            // Добавляем превью изображения, если включено и файл — картинка
            this._renderUIImages(file, $li);

            // Добавляем информационную часть (имя, размер), если включено
            if (this._params.info) {
                const $infoContainer = this._tpl.div({ class: 'file-info' }, [
                    this._tpl.span({ class: 'iteration' }, `${i + 1}.`),
                    this._tpl.span({ class: 'name' }, file.name),
                    this._tpl.span({ class: 'size' }, `[${this._getSizes(file.size)}]`)
                ]);
                $li.appendChild($infoContainer);
            }

            // Добавляем кнопку удаления, если разрешено
            if (this._params.detach) {
                const $fileRemove = this._tpl.div({ class: 'file-remove' }, [
                    this._setButtonElement(file, isAjax)
                ])
                $li.appendChild($fileRemove);
            }

            fragment.appendChild($li);
        });

        $list.innerHTML = '';
        $list.appendChild(fragment);
    }

    _renderUIImages(file, $container) {
        if (this._params.image) {
            const $imgContainer = this._tpl.div({ class: 'file-image' });

            if (file.type.startsWith('image/')) {
                const src = URL.createObjectURL(file);
                this._objectUrls.push(src);
                const $imgPreview = this._tpl.img(src, file.name, { class: 'file-preview' });
                $imgContainer.appendChild($imgPreview);
            } else {
                let icon = 'file-generic';
                if (file.type === 'application/pdf') {
                    icon = 'file-pdf';
                } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                    icon = 'file-word';
                } else if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                    icon = 'file-excel';
                } else if (file.type === 'application/zip' || file.name.endsWith('.zip') || file.name.endsWith('.rar') || file.name.endsWith('.7z')) {
                    icon = 'file-zip';
                } else if (file.name.endsWith('.txt')) {
                    icon = 'file-text';
                }

                const $icon = this._tpl.i({}, getSVG(icon), { isHTML: true });
                $imgContainer.appendChild($icon);
            }

            $container.appendChild($imgContainer);
        }
    }

    /**
     * Генерация скрытых input'ов для отправки формы
     */
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

    /**
     * Добавление новых файлов с фильтрацией
     */
    append(values) {
        const fileMap = new Map(this._files.map(f => [this._getFileKey(f), f]));

        Array.from(values).forEach(file => {
            fileMap.set(this._getFileKey(file), file);
        });

        this._files = this._filterFiles(Array.from(fileMap.values()));
        this._renderErrors();

        return this._files;
    }

    /**
     * Удаление файла по кнопке
     */
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

        // Синхронизируем id с остальными элементами (если нужно)
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

        // Вызов колбека удаления файла
        this._triggerCallback('onRemoveFile', {
            button: button,
            name: name,
            size: size,
            id: id,
            remaining: this._files.length
        });
    }

    /**
     * Обновление статистики после удаления файла
     */
    _updateStatsAfterRemove() {
        if (!this._params.ajax) return;

        // Обновляем значения статистики
        this._setStatItem('completed', this._uploadedKeys.size);
        this._setStatItem('pending', this._pendingUploadedKeys.size);
        this._setStatItem('failing', this._failingUploadedKeys.size);

        // Также обновляем общий счётчик файлов и размер
        this._updateStat();
    }

    /**
     * Фильтрация файлов по ограничениям
     */
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

    /**
     * Форматирование размера файла
     */
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

    /**
     * Очистка сгенерированных input'ов
     */
    _cleanupFakeInputs(isAllowed = false) {
        if (isAllowed) {
            Selectors.findAll('[type="file"]', this._element).forEach(i => i.value = '');
        }

        Selectors.findAll(SELECTOR_DATA_FAKE, this._element).forEach(el => el.remove());
    }

    /**
     * Очистка блока ошибок
     */
    _cleanupErrors() {
        this._errors.clear();
        const $errorCont = Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element);
        if ($errorCont) $errorCont.remove();
    }

    /**
     * Отображение ошибок в UI
     */
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

    /**
     * Резервные сообщения об ошибках
     */
    _getFallbackErrors() {
        const { count, sizes, total } = this._params.limits;
        return {
            'is-count': `Limit: ${count}`,
            'is-sizes': `Max size: ${sizes}MB`,
            'is-total-size': `Total max size: ${total}MB`,
            'is-types': `Allowed: ${this._params.types.join(', ')}`
        };
    }

    /**
     * Подписка на события
     */
    _addEventListener() {
        Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
            el.addEventListener('change', () => this.change(el));
        });
    }

    /**
     * Уникальный ключ файла
     */
    _getFileKey(file) {
        return `${file.name}-${file.size}`;
    }

    /**
     * Блокировка оригинального input от отправки
     */
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

    /**
     * Восстановление оригинального input перед отправкой формы
     */
    _restoreOriginalInputForSubmit() {
        const originalInput = Selectors.find(SELECTOR_DATA_TOGGLE, this._element);
        if (originalInput?.dataset.originalName) {
            originalInput.name = originalInput.dataset.originalName;
            delete originalInput.dataset.originalName;
        }
    }

    /**
     * Полная очистка компонента
     */
    clear(all = false, isAjax = false) {
        const clearUI = () => {
            if (this._nodes.drop) {
                [`.${CLASS_NAME_DROP_LIST}`].forEach(selector => {
                    const el = Selectors.find(selector, this._element);
                    if (el) el.innerHTML = '';
                });

                Classes.add(this._nodes.dropMessage, 'show');
                Classes.remove(this._nodes.drop, 'active');
            } else {
                [`.${CLASS_NAME_INFO_LIST}`].forEach(selector => {
                    const el = Selectors.find(selector, this._element);
                    if (el) el.innerHTML = '';
                });
            }

            if (this._nodes.stat) Classes.remove(this._nodes.stat, 'show');
        };

        if (!this._params.ajax && !this._uploadedKeys.size) {
            this._revokeUrls();
            clearUI();
        }

        if (all) {
            if (this._params.ajax && this._uploadedKeys.size && this._params.removes.all.route && isAjax) {
                const getFilesLoaded = () => {
                    const files = [];

                    let className = CLASS_NAME_INFO_LIST;
                    if (this._nodes.drop) className = CLASS_NAME_DROP_LIST;

                    Selectors.findAll(`.${className} li.${CLASS_NAME_LOADED}`, this._element).forEach(li => files.push(li));
                    return files;
                };

                const filesLoaded = getFilesLoaded();

                if (filesLoaded.length) {
                    const ids = filesLoaded.map(li => {
                        const button = Selectors.find('button', li);
                        return isElement(button) ? normalizeData(Manipulator.get(button, 'data-id')) : null;
                    }).filter(Boolean);

                    if (!ids.length) return;

                    const btnDelete = Selectors.find(SELECTOR_DATA_DISMISS_ALL, this._element);
                    const _completeClearRoute = (data) => {
                        clearUI();
                        this._cleanupErrors();
                        if (this._nodes.info) {
                            Classes.remove(this._nodes.info, 'show');
                        } else {
                            Classes.add(this._nodes.dropMessage, 'show');
                        }
                        this._files = [];
                        this._uploadedKeys.clear();

                        this._resetFileInput();

                        if (this._params.removes.all.toast) {
                            VGToast.run(data.response?.message);
                        }
                    };

                    const paramsAjax = {
                        route: this._params.removes.all.route,
                        data: { ids: ids.join(',') },
                        method: 'post'
                    };

                    if (this._params.removes.all.alert) {
                        VGAlert.confirm(btnDelete, {
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
                                title: lang_messages(this._params.lang, NAME)['titles'],
                                description: lang_messages(this._params.lang, NAME)['descriptions']
                            }
                        });

                        EventHandler.one(btnDelete, 'vg.alert.accept', (event) => {
                            _completeClearRoute(event.vgalert.data);
                        });
                    } else {
                        this._params.ajax = paramsAjax;
                        this._route((status, data) => {
                            _completeClearRoute(data);
                        });
                    }
                }
            } else {
                this._resetFileInput();
                this._cleanupFakeInputs();
                this._cleanupErrors();
                this._files = [];
                this._uploadedKeys.clear();

                if (this._nodes.info) {
                    Classes.remove(this._nodes.info, 'show');
                } else if (this._nodes.drop) {
                    const $list = Selectors.find(`.${CLASS_NAME_DROP_LIST}`, this._element);
                    if ($list) $list.remove();

                    Classes.add(this._nodes.dropMessage, 'show');
                    Classes.remove(this._nodes.drop, 'active');
                }

                if (this._nodes.stat) Classes.remove(this._nodes.stat, 'show');
            }
        }

        // Вызов колбека очистки
        this._triggerCallback('onClear', {
            all: all,
            isAjax: isAjax,
            filesRemaining: this._files.length
        });
    }

    /**
     * Очистка ObjectURL
     */
    _revokeUrls() {
        this._objectUrls.forEach(url => URL.revokeObjectURL(url));
        this._objectUrls = [];
    }

    /**
     * Сброс оригинального input[type="file"] для возможности повторного выбора одинаковых файлов
     */
    _resetFileInput() {
        const fileInputs = Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element);
        fileInputs.forEach(input => {
            input.value = ''; // Сбрасываем значение
        });
    }

    /**
     * Вспомогательный метод для вызова колбеков
     */
    _triggerCallback(callbackName, data = {}) {
        const callback = this._params.callbacks?.[callbackName];
        if (typeof callback === 'function') {
            try {
                callback.call(this, data, this);
            } catch (error) {
                console.error(`Error in ${callbackName} callback:`, error);
            }
        }
    }

    /**
     * Очистка ресурсов
     */
    dispose() {
        this.clear(true);
        if (this._uploader) this._uploader.destroy();
        super.dispose();
    }
}

// Автоинициализация
EventHandler.on(document, EVENT_KEY_DOM_LOADED_DATA_API, () => {
    Selectors.findAll(`.${CLASS_NAME_CONTAINER}`).forEach(el => VGFiles.getOrCreateInstance(el));
});

// Обработка удаления одного файла
EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (!target) return;
    e.preventDefault();

    const button = e.target.closest(SELECTOR_DATA_DISMISS) || e.target;
    VGFiles.getOrCreateInstance(target).removeFile(button);
});

// Обработка удаления всех файлов
EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS_ALL, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (!target) return;
    e.preventDefault();

    VGFiles.getOrCreateInstance(target).clear(true, true);
});

// Обработка повторной загрузки файла
EventHandler.on(document, EVENT_KEY_RELOAD_DATA_API, SELECTOR_DATA_RELOAD, function (e) {
    const target = e.target.closest(`.${CLASS_NAME_CONTAINER}`);
    if (!target) return;
    e.preventDefault();

    const button = e.target.closest(SELECTOR_DATA_RELOAD) || e.target;
    VGFiles.getOrCreateInstance(target).reload(button);
});

export default VGFiles;