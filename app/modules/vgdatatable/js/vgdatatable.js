import BaseModule from "../../base-module";
import {isEmptyObj, isObject, mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

const NAME             = 'datatable';
const NAME_KEY         = 'vg.datatable';

const CLASS_NAME_LOADER  = 'vg-table-loader';

const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

class VGDataTable extends BaseModule {
	constructor(element, params) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			mode: 'table', // варианты: table, list, card
			table: {
				padding: 0,
				width: 0,
				classes: []
			},
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
		this.paginateCountSlice = 0;
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
		/*this._setBuildMode();

		if (this._params.ajax.enabled) {
			this._route((status, data) => {
				setTimeout(() => {
					EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});

					// todo это можно сделать на стороне сервера
					let d = normalizeData(data.response),
						arr = d.slice(this.paginateCountSlice, this.paginateCount);


					this._setBuildMode(arr);
				}, 1000);
			});
		}*/
	}

	_setBuildMode(data = {}) {
		switch (this._params.mode) {
			case 'table': this._modeBuildTable(data); break;
			//case 'list':  this._modeBuildList(data);  break;
			//case 'card':  this._modeBuildCard(data);  break;
		}
	}

	_modeBuildTable(data) {
	/*	let tbody = Selectors.find('tbody', this._element),
			thead = Selectors.find('thead', this._element);

		if (!thead && !tbody) return;

		let countTD = [... Selectors.findAll('th', thead)].length;
		if (!countTD) return;

		let setData = (data, isLoading = false) => {
			if (!isLoading) {
				tbody.innerHTML = '';
			}

			console.log(data)

			for (let i = 1; i <= this.paginateCount; i++) {
				let tr = document.createElement('tr');

				for (let n = 1; n <= countTD; n++) {
					let td = document.createElement('td');
					if (this._params.table.width > 0) td.style.width = this._params.table.width;
					if (this._params.table.padding > 0) td.style.padding  = this._params.table.padding;
					if (this._params.table.classes.length) td.classList.add(... this._params.table.classes);

					if (isLoading) {
						td.innerHTML = '<div class="'+ CLASS_NAME_LOADER +'"></div>';
					} else {
						td.innerHTML = Object.keys(data[i - 1])[n - 1];
					}


					tr.append(td);
				}

				tbody.append(tr);
			}
		}

		if (isEmptyObj(data) && this._params.loader) {
			setData({}, true);
		} else {
			setData(data)
		}

		/!*if (isObject(data)) {
			for (const datum of data) {
				console.log(datum)
			}
		} else {
			target.innerHTML = data;
		}*!/*/
	}

	_modeBuildList(data) {

	}

	_modeBuildCard(data) {

	}
}

export default VGDataTable;