/**
 * Описание: собирает плейлист карточек медиафайлов для окна предпросмотра.
 * Возможности: определяет тип по общим метаданным, включая локальные blob URL и серверные маршруты без расширения.
 */
import FilePreviewHelper from "../../../../utils/js/components/file-preview";

const getPathFromElement = (element) => {
	const value = element?.getAttribute('data-vg-filepreview') || '';
	return String(value).trim();
};

const toAbsoluteUrl = (path) => {
	try {
		return new URL(path, window.location.origin).href;
	} catch {
		return '';
	}
};

const resolveTitle = (element, fallbackPath = '') => {
	const node = element?.querySelector('.name');
	const title = String(node?.textContent || '').trim();
	if (title) {
		return title;
	}

	const name = String(fallbackPath).split('/').pop() || '';
	return decodeURIComponent(name);
};

const resolveSubtitle = (element) => {
	const node = element?.querySelector('.original_name');
	return String(node?.textContent || '').trim();
};

const buildMediaPlaylist = (currentElement, acceptExt = () => true) => {
	const nodes = Array.from(document.querySelectorAll('[data-vg-filepreview][data-vg-filepreview-valid="true"]'));
	const tracks = nodes
		.map((element) => {
			const path = getPathFromElement(element);
			const src = toAbsoluteUrl(path);
			const ext = new FilePreviewHelper(element).getFileMeta(path).ext;
			return {
				element,
				path,
				src,
				ext,
				title: resolveTitle(element, path),
				subtitle: resolveSubtitle(element)
			};
		})
		.filter((item) => item.src && acceptExt(item.ext));

	const currentSrc = toAbsoluteUrl(getPathFromElement(currentElement));
	const currentIndex = tracks.findIndex((item) => item.src === currentSrc);

	return {
		tracks,
		currentIndex: currentIndex >= 0 ? currentIndex : 0
	};
};

export { buildMediaPlaylist };
