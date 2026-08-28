/**
 * Описание: определение категории файла и соответствующей SVG-иконки.
 * Возможности: распознаёт MIME-тип и расширение, поддерживает явные имена иконок и общий fallback.
 */
const FILE_ICON_BY_EXT = {
	pdf: 'file-pdf',
	doc: 'file-word',
	docx: 'file-word',
	odt: 'file-word',
	rtf: 'file-word',
	xls: 'file-exel',
	xlsx: 'file-exel',
	xlsm: 'file-exel',
	ods: 'file-exel',
	csv: 'file-exel',
	zip: 'file-zip',
	rar: 'file-zip',
	'7z': 'file-zip',
	tar: 'file-zip',
	gz: 'file-zip',
	tgz: 'file-zip',
	txt: 'file-text',
	md: 'file-text',
	log: 'file-text',
	json: 'file-text',
	xml: 'file-text',
	yml: 'file-text',
	yaml: 'file-text',
	php: 'file-php',
	png: 'file-image',
	jpg: 'file-image',
	jpeg: 'file-image',
	gif: 'file-image',
	webp: 'file-image',
	svg: 'file-image',
	bmp: 'file-image',
	tif: 'file-image',
	tiff: 'file-image',
	heic: 'file-image',
	heif: 'file-image',
	avif: 'file-image',
	ico: 'file-image',
	mp3: 'file-audio',
	wav: 'file-audio',
	ogg: 'file-audio',
	flac: 'file-audio',
	aac: 'file-audio',
	m4a: 'file-audio',
	mp4: 'file-video',
	webm: 'file-video',
	mov: 'file-video',
	mkv: 'file-video',
	avi: 'file-video'
};

const extractExtension = (value) => {
	if (!value) return '';

	const cleanValue = String(value).toLowerCase().split('#')[0].split('?')[0];
	const lastSegment = cleanValue.split('/').pop() || '';
	if (!lastSegment.includes('.')) return '';

	return lastSegment.split('.').pop() || '';
};

const parseFileDescriptor = (value) => {
	if (!value) return {type: '', ext: ''};

	if (typeof value === 'object') {
		const type = String(value.type || '').toLowerCase();
		const name = String(value.name || value.path || value.url || '').toLowerCase();
		return {type, ext: extractExtension(name)};
	}

	return {type: '', ext: extractExtension(value)};
};

const resolveFileIconName = (descriptor) => {
	const {type, ext} = parseFileDescriptor(descriptor);

	if (type === 'application/pdf') return 'file-pdf';
	if (type.includes('word')) return 'file-word';
	if (type.includes('excel') || type.includes('spreadsheet')) return 'file-exel';
	if (type.includes('zip') || type.includes('compressed')) return 'file-zip';
	if (type.startsWith('text/')) return 'file-text';
	if (type.startsWith('image/')) return 'file-image';
	if (type.startsWith('audio/')) return 'file-audio';
	if (type.startsWith('video/')) return 'file-video';

	return FILE_ICON_BY_EXT[ext] || 'file-generic';
};

const getSVG = (name, icons = {}) => {
	const explicitIcon = icons[name];
	if (explicitIcon) {
		return explicitIcon;
	}

	const autoIconName = resolveFileIconName(name);
	const autoIcon = icons[autoIconName];
	if (autoIcon) {
		return autoIcon;
	}

	return icons['file-generic'] || '';
};

export {
	FILE_ICON_BY_EXT,
	extractExtension,
	parseFileDescriptor,
	resolveFileIconName,
	getSVG
};
