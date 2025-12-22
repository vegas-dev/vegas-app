import {normalizeData} from "../functions";

const langs = {
	ru: {
		messages: {
			errors: {
				went_wrong: 'Что-то пошло не так, повторите позже',
				"400": 'Неверный запрос',
				"401": 'Не авторизован',
				"403": 'Запрещено',
				"404": 'Не найдено',
				"413": 'Слишком большой запрос',
				"419": 'Проблемы с токеном CSRF',
				"422": 'Неверный запрос',
				"500": 'Внутренняя ошибка сервера',
				"504": 'Превышено время ожидания'
			},
			'form-sender': {
				'bootstrap_not_found': 'VGApp не удалось найти bootstrap, модалки не будут закрыты, попробуйте сделать это через коллбек afterSend.'
			},
			'files': {
				'is-count': 'Превышен лимит по количеству файлов',
				'is-sizes': 'Превышен размер файл',
				'is-types': 'Недопустимый тип файла',
				'is-total-size': 'Превышен максимально разрешённый размер для выбранных файлов'
			},
			alert: {
				title: 'Заголовок по умолчанию',
				description: 'Описание текущего действия',
				reason: 'Алерт уже открыт'
			}
		},
		titles: {
			errors: {
				title: 'Ошибка',
				titles: 'Ошибки'
			}
		},
		buttons: {
			alert: {
				agree: 'Да, согласен',
				cancel: 'Отмена'
			}
		}
	},
	en: {
		messages: {
			errors: {
				went_wrong: 'Something went wrong, please repeat later',
				"400": 'Bad Request',
				"401": 'Unauthorized',
				"403": 'Forbidden',
				"404": 'Not Found',
				"413": 'Payload Too Large',
				"419": 'Problems with the CSRF token',
				"422": 'Unprocessable Entity',
				"500": 'Internal Server Error',
				"504": 'Gateway Timeout'
			},
			'form-sender': {
				'bootstrap_not_found': 'VGApp could not find bootstrap, the modals will not be closed, try to do this through the afterSend callback.'
			},
			alert: {
				title: 'Default header',
				description: 'Description of the current action',
				reason: 'Alert already open'
			},
			'files': {
				'is-count': 'Exceeded the limit on the number of files',
				'is-sizes': 'File size exceeded',
				'is-types': 'Invalid file type',
				'is-total-size': 'The maximum allowed size for the selected files has been exceeded'
			},
		},
		titles: {
			errors: {
				title: 'Error',
				titles: 'Errors'
			}
		},
		buttons: {
			alert: {
				agree: 'Yeah, I agree',
				cancel: 'Cancel'
			}
		}
	},
};

class Lang {
	constructor(lang = 'en') {
		this.lang = lang;
	}

	get() {
		let data = langs[this.lang];

		if (!data) data = langs['en'];

		return normalizeData(data);
	}
}

function lang(lg, mode, module) {
	return new Lang(lg).get()[mode][module];
}

function lang_titles(lg, module) {
	return lang(lg, 'titles', module) || {};
}

function lang_messages(lg, module) {
	return lang(lg, 'messages', module) || {};
}

function lang_buttons(lg, module) {
	return lang(lg, 'buttons', module) || {};
}

export {lang, lang_messages, lang_titles, lang_buttons};