export function normalizeNonNegativeInt(value, fallback = 0) {
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function normalizeBooleanOption(value, fallback = false) {
	if (value === undefined || value === null) {
		return fallback;
	}
	const normalized = String(value).toLowerCase().trim();
	if (normalized === 'true' || normalized === '1') {
		return true;
	}
	if (normalized === 'false' || normalized === '0') {
		return false;
	}
	return Boolean(value);
}

export function normalizeEnabledFlag(value, fallback = true) {
	if (value === undefined || value === null) {
		return fallback;
	}
	const normalized = String(value).toLowerCase().trim();
	return normalized !== 'false' && normalized !== '0';
}

export function safeQuerySelector(selector, root = document) {
	const normalized = String(selector || '').trim();
	if (!normalized || !root || typeof root.querySelector !== 'function') {
		return null;
	}
	try {
		return root.querySelector(normalized);
	} catch (error) {
		return null;
	}
}

export function toQueryParamValue(value) {
	if (!Array.isArray(value)) {
		return value;
	}
	return value
		.map((item) => String(item || '').trim())
		.filter((item) => item !== '')
		.join(',');
}
