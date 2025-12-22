import Selectors from "../../../utils/js/dom/selectors";

class DragDropFiles {
	constructor(element, params) {
		if (!element) return
		this._element = Selectors.find(element);
	}

	init() {

	}

	_addEventListeners() {
		const dropZone = this._element;

		// Добавляем визуальный класс при наведении
		const handleDragOver = (e) => {
			e.preventDefault();
			e.stopPropagation();
			console.log(this._element.classList.contains('drag-over'))
			if (!this._element.classList.contains('drag-over')) {
				this._element.classList.add('drag-over');
			}
		};

		const handleDragLeave = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this._element.classList.remove('drag-over');
		};

		const handleDrop = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this._element.classList.remove('drag-over');

			const files = e.dataTransfer.files;
			if (files.length) {
				this._handleDroppedFiles(files);
			}
		};

		// Сохраняем обработчики для возможности удаления
		this._dragHandlers = { handleDragOver, handleDragLeave, handleDrop };

		this._element.addEventListener('dragover', handleDragOver);
		this._element.addEventListener('dragleave', handleDragLeave);
		this._element.addEventListener('drop', handleDrop);
	}

	dispose() {
		super.dispose();

		// Удаляем drag & drop обработчики
		/*if (this._dragHandlers && this._params.dragDrop) {
			const dropZone = this._element;
			dropZone.removeEventListener('dragover', this._dragHandlers.handleDragOver);
			dropZone.removeEventListener('dragleave', this._dragHandlers.handleDragLeave);
			dropZone.removeEventListener('drop', this._dragHandlers.handleDrop);
			this._dragHandlers = null;
		}*/
	}

	_handleDroppedFiles(files) {
		// Создаём временный инпут для эмуляции события change
		const tempInput = document.createElement('input');
		tempInput.type = 'file';
		tempInput.files = files;

		// Эмулируем change событие
		this.change(tempInput);
	}

}

export default DragDropFiles;