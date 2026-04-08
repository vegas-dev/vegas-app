import { lang_buttons, lang_messages } from "../../../utils/js/components/lang";

const SUPPORTED_LANGS = new Set(["ru", "en"]);

const normalizeLang = (value, fallback = "ru") => {
	const candidate = String(value || "").trim().toLowerCase();
	if (!candidate) {
		return fallback;
	}

	const short = candidate.split("-")[0];
	return SUPPORTED_LANGS.has(short) ? short : fallback;
};

const resolveFilePreviewLang = (paramsLang, element) => {
	const fromParams = normalizeLang(paramsLang, "");
	if (fromParams) {
		return fromParams;
	}

	const fromElement = normalizeLang(element?.getAttribute("lang"), "");
	if (fromElement) {
		return fromElement;
	}

	const fromClosest = normalizeLang(element?.closest("[lang]")?.getAttribute("lang"), "");
	if (fromClosest) {
		return fromClosest;
	}

	const fromHtml = normalizeLang(document?.documentElement?.getAttribute("lang"), "");
	if (fromHtml) {
		return fromHtml;
	}

	const fromNavigator = normalizeLang(window?.navigator?.language, "");
	if (fromNavigator) {
		return fromNavigator;
	}

	return "ru";
};

const createFilePreviewI18n = (lang = "ru") => {
	const normalizedLang = normalizeLang(lang, "ru");
	const messages = lang_messages(normalizedLang, "filepreview") || {};
	const buttons = lang_buttons(normalizedLang, "filepreview") || {};

	return {
		lang: normalizedLang,
		message: (key, fallback = "") => messages[key] || fallback,
		button: (key, fallback = "") => buttons[key] || fallback
	};
};

export { createFilePreviewI18n, resolveFilePreviewLang };
