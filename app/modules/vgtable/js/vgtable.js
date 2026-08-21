import BaseModule from "../../base-module";
import {mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";


/**
 * Константы
 */
const NAME = 'table';
const NAME_KEY = 'vg.' + NAME;

const MAIN_SELECTOR_CLASS = 'vg-table';
const SELECTOR_DATA_TOGGLE = '[data-vg-table]';


const DEFAULT_OPTIONS = {

}

class VGTable extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);
		this._params = this._getParams(element, mergeDeepObject(DEFAULT_OPTIONS, params));

	}

	static get NAME() { return NAME; }

	static get NAME_KEY() { return NAME_KEY; }

	init() {

	}
}

EventHandler.on(document, 'DOMContentLoaded', () => {
	Selectors.findAll(SELECTOR_DATA_TOGGLE).forEach((el) => {
		new VGTable(el).init();
	})
});

export default VGTable;

