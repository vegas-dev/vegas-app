import Selectors from "../../../utils/js/dom/selectors";

class DragDropFiles {
	constructor(element, params) {
		if (!element) return
		this._element = Selectors.find(element);
	}

	init() {
		//console.log(this._element);
	}
}

export default DragDropFiles;