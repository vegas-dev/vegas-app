/**
 * Описание: словари и разрешение локализованных подписей VGTable.
 * Возможности: встроенные ru/en локали, региональные коды, пользовательские словари и подстановка переменных.
 */

const DEFAULT_LOCALE = 'ru';

const DEFAULT_I18N = {
	ru: {
		pagination: {
			size: {label: 'Строк на странице', suffix: 'на страницу'},
			quick: {label: 'Перейти к странице', button: 'Перейти'},
			labels: {
				aria: 'Пагинация', prev: 'Назад', next: 'Вперёд',
				ellipsisPrev: 'Перейти к предыдущим страницам', ellipsisNext: 'Перейти к следующим страницам',
			},
		},
		expandable: {labels: {expand: 'Развернуть дочерние строки', collapse: 'Свернуть дочерние строки'}},
		state: {labels: {
			empty: 'Нет данных', 'filtered-empty': 'По вашему запросу ничего не найдено',
			error: 'Не удалось загрузить данные', retry: 'Повторить', reset: 'Сбросить фильтры',
		}},
		columnResize: {label: 'Изменить ширину колонки {column}'},
		rowReorder: {labels: {
			handle: 'Изменить позицию строки {row}',
		}},
		remote: {loading: 'Загрузка…', empty: 'Ничего не найдено', error: 'Не удалось загрузить данные', retry: 'Повторить'},
	},
	en: {
		pagination: {
			size: {label: 'Rows per page', suffix: 'per page'},
			quick: {label: 'Go to page', button: 'Go'},
			labels: {
				aria: 'Pagination', prev: 'Previous', next: 'Next',
				ellipsisPrev: 'Jump to previous pages', ellipsisNext: 'Jump to next pages',
			},
		},
		expandable: {labels: {expand: 'Expand child rows', collapse: 'Collapse child rows'}},
		state: {labels: {
			empty: 'No data', 'filtered-empty': 'No results found', error: 'Failed to load data', retry: 'Retry', reset: 'Reset filters',
		}},
		columnResize: {label: 'Resize column {column}'},
		rowReorder: {labels: {
			handle: 'Change position of row {row}',
		}},
		remote: {loading: 'Loading…', empty: 'Nothing found', error: 'Failed to load data', retry: 'Retry'},
	},
};

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

const merge = (...sources) => sources.reduce((target, source) => {
	if (!isObject(source)) return target;
	Object.entries(source).forEach(([key, value]) => {
		target[key] = isObject(value) ? merge(isObject(target[key]) ? target[key] : {}, value) : value;
	});
	return target;
}, {});

const normalizeLocale = locale => String(locale || DEFAULT_LOCALE).trim().toLowerCase().replace('_', '-') || DEFAULT_LOCALE;

const localeCandidates = locale => {
	const normalized = normalizeLocale(locale);
	const base = normalized.split('-')[0];
	return normalized === base ? [normalized] : [normalized, base];
};

const resolveDictionary = (locale, dictionaries = {}) => {
	const all = merge({}, DEFAULT_I18N, dictionaries);
	const fallback = all[DEFAULT_LOCALE] || {};
	const localized = localeCandidates(locale).map(key => all[key]).find(Boolean) || fallback;
	return merge({}, fallback, localized);
};

export {normalizeLocale, resolveDictionary};
