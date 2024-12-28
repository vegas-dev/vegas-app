import BaseModule from "../../base-module";

/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.form-sender';

/**
 * Constants Classes
 */
const SELECTOR_DATA_TOGGLE = '[data-vgformsender]';

/**
 * Constants Events
 */
const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

/**
 * Default Params
 */
const PARAMS_DEFAULT =  {

};

class VGFormSender extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		if (this.params.animation === false) {
			this.params.timeoutAnimation = 10
		}
	}

	static get Default() {
		return PARAMS_DEFAULT
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	build() {

	}

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 */
	static init(element, params = {}) {
		const instance = VGFormSender.getOrCreateInstance(element, params);
		instance.build();
	}
}

export default VGFormSender;