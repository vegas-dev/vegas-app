/**
 * Описание: реестр именованных групп параметров VGTable.
 * Возможности: регистрация общих конфигураций и их подключение одним data-group-params.
 */

const groups = new Map();

const normalizeName = (name) => String(name || '').trim();

const registerParamsGroup = (name, params = {}) => {
	const key = normalizeName(name);
	if (!key || !params || typeof params !== 'object' || Array.isArray(params)) return false;
	groups.set(key, params);
	return true;
};

const unregisterParamsGroup = (name) => groups.delete(normalizeName(name));

const getParamsGroup = (name) => groups.get(normalizeName(name)) || null;

export {getParamsGroup, registerParamsGroup, unregisterParamsGroup};
