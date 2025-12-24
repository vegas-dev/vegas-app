import { isElement, mergeDeepObject } from "../functions";
import { Manipulator } from "../dom/manipulator";

/**
 * Класс Params
 * Объединяет параметры из объекта и атрибутов элемента, поддерживает вложенные параметры через дефисы
 */
class Params {
	constructor(params, element = null) {
		this._params = this.merge(params, element);
	}

	/**
	 * Возвращает итоговые параметры
	 */
	get() {
		return this._params;
	}

	/**
	 * Извлекает параметры из data-атрибутов элемента
	 */
	fromElement(element) {
		return isElement(element) ? Manipulator.get(element) : {};
	}

	/**
	 * Преобразует строку вида 'foo-bar-baz' в вложенный объект { foo: { bar: { baz: value } } }
	 */
	static stringToNestedObject(str, value) {
		return str.split('-').reduceRight((acc, key) => ({ [key]: acc }), value);
	}

	/**
	 * Слияние параметров: объект + data-атрибуты + обработка вложенности и ключа 'params'
	 */
	merge(params, element) {
		let merged = mergeDeepObject(params, this.fromElement(element));

		// Обработка вложенных ключей через дефисы и ключа 'params'
		Object.keys(merged).forEach(key => {
			if (key === 'params') {
				merged = mergeDeepObject(merged, merged.params);
				delete merged.params;
			}

			if (key.includes('-')) {
				const nestedObj = Params.stringToNestedObject(key, merged[key]);
				merged = mergeDeepObject(merged, nestedObj);
				delete merged[key];
			}
		});

		return merged;
	}
}

export default Params;