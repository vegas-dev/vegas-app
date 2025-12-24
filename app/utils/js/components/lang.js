import { normalizeData } from "../functions";

// Синхронный импорт JSON-файлов (включаются в бандл Webpack/Vite)
import messagesRu from '../../../langs/ru/messages.json';
import titlesRu from '../../../langs/ru/titles.json';
import buttonsRu from '../../../langs/ru/buttons.json';

import messagesEn from '../../../langs/en/messages.json';
import titlesEn from '../../../langs/en/titles.json';
import buttonsEn from '../../../langs/en/buttons.json';

// Синхронные данные, загруженные при сборке
const langData = {
	ru: normalizeData({
		messages: messagesRu,
		titles: titlesRu,
		buttons: buttonsRu
	}),
	en: normalizeData({
		messages: messagesEn,
		titles: titlesEn,
		buttons: buttonsEn
	})
};

/**
 * Класс для управления языком (синхронный)
 */
class Lang {
	/**
	 * @param {string} lang - Язык (ru, en и т.д.)
	 */
	constructor(lang = 'en') {
		this.lang = lang;
	}

	/**
	 * Получение языкового пакета
	 * @returns {Object}
	 */
	get() {
		return langData[this.lang] || langData['en'];
	}
}

/**
 * Получение языкового раздела
 * @param {string} language - Язык
 * @param {string} mode - messages, titles, buttons
 * @param {string} module - Модуль (files, alert и т.д.)
 * @returns {Object}
 */
function getLangData(language = 'en', mode, module) {
	const langInstance = new Lang(language);
	const data = langInstance.get();
	return data[mode]?.[module] || {};
}

/**
 * Получение заголовков
 * @param {string} language
 * @param {string} module
 * @returns {Object}
 */
function lang_titles(language, module) {
	return getLangData(language, 'titles', module);
}

/**
 * Получение сообщений
 * @param {string} language
 * @param {string} module
 * @returns {Object}
 */
function lang_messages(language, module) {
	return getLangData(language, 'messages', module);
}

/**
 * Получение текстов кнопок
 * @param {string} language
 * @param {string} module
 * @returns {Object}
 */
function lang_buttons(language, module) {
	return getLangData(language, 'buttons', module);
}

export { lang_messages, lang_titles, lang_buttons };