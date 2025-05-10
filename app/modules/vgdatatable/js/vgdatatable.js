import BaseModule from "../../base-module";
import {isObject, mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

const NAME             = 'datatable';
const NAME_KEY         = 'vg.datatable';

const CLASS_NAME_LOADER       = 'vg-datatable-loader';
const CLASS_NAME_LOADER_AFTER = 'vg-datatable-loader--after';

const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

class VGDataTable extends BaseModule {
	constructor(element, params) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			mode: 'table', // варианты: table, list, card
			paginate: {
				enabled: true,
				stack: true,
				items: 10
			},
			loader: true,

			ajax: {
				enabled: true,
				route: '',
				target: '',
				method: 'get',
				loader: false,
			}
		}, params));

		this.paginateCount = this._params.paginate.items;
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static init(el, params = {}) {
		let instance = VGDataTable.getOrCreateInstance(el, params);
		instance.build();
	}

	build() {
		if (this._params.loader) {
			this._element.classList.add(CLASS_NAME_LOADER_AFTER);
			this._element.parentElement.style.position = 'relative';
			this._element.insertAdjacentHTML('beforebegin', '<div class="'+ CLASS_NAME_LOADER +'"><div class="vg-loader"></div></div>')
		}

		if (this._params.ajax.enabled) {
			this._route((status, data) => {
				setTimeout(() => {
					EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});

					if (this._params.loader) {
						this._element.classList.remove(CLASS_NAME_LOADER_AFTER);
						Selectors.find('.' + CLASS_NAME_LOADER).remove();
					}

					this._setBuildMode(normalizeData(data.response));
				}, 1000);
			});
		} else {
			// TODO берем данные которые уже есть странице и загружены
		}
	}

	_setBuildMode(data) {
		if (!data) return;

		switch (this._params.mode) {
			case 'table': this._modeBuildTable(data); break;
			case 'list':  this._modeBuildList(data);  break;
			case 'card':  this._modeBuildCard(data);  break;
		}
	}

	_modeBuildTable(data) {
		let target = Selectors.find('tbody', this._element);

		if (isObject(data)) {
			for (const datum of data) {
				console.log(datum)
			}
		} else {
			target.innerHTML = data;
		}
	}

	_modeBuildList(data) {

	}

	_modeBuildCard(data) {

	}
}

export default VGDataTable;