const getPathFromElement = (element) => {
	const value = element?.getAttribute('data-vg-filepreview') || '';
	return String(value).trim();
};

const parseExt = (path) => {
	if (!path) {
		return '';
	}

	const clean = String(path).split('#')[0].split('?')[0];
	const name = clean.split('/').pop() || '';
	if (!name.includes('.')) {
		return '';
	}

	return `.${String(name.split('.').pop() || '').toLowerCase()}`;
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
			const ext = parseExt(path);
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
