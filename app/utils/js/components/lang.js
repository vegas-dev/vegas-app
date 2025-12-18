import {execute, normalizeData} from "../functions";

class Lang {
	constructor(lang, mode, module) {
		this.currentLang = lang || 'ru';
		this.currentModule = module || 'default';
		this.currentMode = mode || 'titles';
		this.path = '../../../utils/lang';

		return this.loadModule();
	}

	async loadModule() {
		let path = this.path + '/' + this.currentLang + '/' + this.currentMode + '.json';

		try {
			const module = await import(path, {
				assert: { type: 'json' }
			});

			return module.default;
		} catch (error) {
			console.warn(error);
		}
	}

	static get(lang, mode, module, callback) {
		let instance = new Lang(lang, mode, module);
		return instance.then(i18n => {
			let m = normalizeData(i18n);
			execute(callback, [m[module]]);

			return m[module];
		})
	}
}

async function lang(lang, mode, module) {
	const result = await Lang.get(lang, mode, module);
	return result;
}

export default lang;