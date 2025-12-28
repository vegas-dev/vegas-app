import Selectors from "../../../utils/js/dom/selectors";
import {isElement, normalizeData} from "../../../utils/js/functions";
import Ajax from "../../../utils/js/components/ajax";
import VGToast from "../../vgtoast";

class VGFilesSortable {
    constructor(vgFilesInstance, options = {}) {
        this._vg = vgFilesInstance;
        this._params = {
            handle: '.file',          // за что хватаемся (можно переопределить в options)
            itemSelector: 'li.file',  // что именно перетаскиваем (можно переопределить в options)
            route: null,
            method: 'POST',
            toast: true,
            ...options
        };

        // Если в options пришёл handle (например ".file"), а itemSelector не задан —
        // будем перетаскивать ближайший LI с этим handle-классом
        if (!options.itemSelector && options.handle) {
            this._params.itemSelector = `li${options.handle}`;
        }

        if (!this._params.route) {
            console.warn('VGFilesSortable: Не указан маршрут `route` для сохранения порядка.');
        }
        if (this._params.lists?.length) {
            this._list = this._params.lists.map(l => Selectors.find('.' + l, this._vg._element)).find(s => s);
        } else {
            this._list = this._vg._nodes.list;
        }

        if (!isElement(this._list)) {
            console.error('VGFilesSortable: Не найден контейнер списка файлов');
            return;
        }

        this._draggedItem = null;

        this._boundOnDragStart = this._onDragStart.bind(this);
        this._boundOnDragEnd = this._onDragEnd.bind(this);
        this._boundOnDragOver = this._onDragOver.bind(this);
        this._boundOnDrop = this._onDrop.bind(this);

        this._init();
    }

    _init() {
        // КЛЮЧЕВОЕ: без draggable dragstart в дропзоне может вообще не стартовать
        this._enableDraggableItems();

        this._setupEvents();
        this._vg._triggerCallback('onSortableInit');
    }

    _enableDraggableItems() {
        const items = this._list.querySelectorAll(this._params.itemSelector);

        items.forEach(li => {
            li.setAttribute('draggable', 'true');

            // Чтобы браузер не пытался тащить картинку как "Files/URI"
            const img = li.querySelector('img');
            if (img) img.setAttribute('draggable', 'false');
        });
    }

    _setupEvents() {
        this._list.addEventListener('dragstart', this._boundOnDragStart);
        this._list.addEventListener('dragend', this._boundOnDragEnd);
        this._list.addEventListener('dragover', this._boundOnDragOver);
        this._list.addEventListener('drop', this._boundOnDrop);
    }

    _onDragStart(e) {
        // Разрешаем стартовать drag только если начали тянуть за handle
        const handleEl = e.target.closest(this._params.handle);
        if (!handleEl) return;

        // А перетаскиваем всегда целый item (li/.vg-files-item)
        const item = e.target.closest(this._params.itemSelector) || e.target.closest('li');
        if (!item) return;

        this._draggedItem = item;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'vgsortable');

        item.classList.add('dragging');
        requestAnimationFrame(() => item.classList.add('dragging-transparent'));
    }

    _onDragEnd(e) {
        if (this._draggedItem) {
            this._draggedItem.classList.remove('dragging', 'dragging-transparent');
            this._draggedItem = null;
            this._saveOrder();
        }
    }

    _onDragOver(e) {
        // ✅ Если сейчас НЕ сортировка — не вмешиваемся.
        // Это важно для drag&drop файлов на дропзону.
        if (!this._draggedItem) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const currentTarget =
            e.target.closest(this._params.itemSelector) ||
            e.target.closest('li');

        if (!currentTarget || currentTarget === this._draggedItem) return;

        const rect = currentTarget.getBoundingClientRect();
        const midpoint = rect.height / 2;
        const offsetFromTop = e.clientY - rect.top;

        if (offsetFromTop < midpoint) {
            this._list.insertBefore(this._draggedItem, currentTarget);
        } else {
            this._list.insertBefore(this._draggedItem, currentTarget.nextSibling);
        }
    }

    _onDrop(e) {
        // ✅ Ключевой фикс:
        // если это не сортировка (нет draggedItem), значит это может быть drop файлов
        // — не блокируем всплытие, пусть обработает VGFilesDroppable на label.
        if (!this._draggedItem) return;

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    _saveOrder() {
        const ids = Array.from(this._list.querySelectorAll('[data-id]'))
            .map(el => {
                const id = normalizeData(el.getAttribute('data-id'));
                return id ? id : null;
            })
            .filter(Boolean);

        if (!ids.length || !this._params.route) return;

        const xhr = new Ajax();
        xhr.post(this._params.route, { ids }, {
            onSuccess: (data) => VGToast.run(data.response.message),
        });
    }

    destroy() {
        this._list.removeEventListener('dragstart', this._boundOnDragStart);
        this._list.removeEventListener('dragend', this._boundOnDragEnd);
        this._list.removeEventListener('dragover', this._boundOnDragOver);
        this._list.removeEventListener('drop', this._boundOnDrop);

        this._draggedItem = null;
    }
}

export default VGFilesSortable