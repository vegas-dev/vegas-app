const AUDIO_EXTENSIONS = new Set(['mp3']);

const readSyncSafeInt = (bytes, offset = 0) => {
	return ((bytes[offset] & 0x7f) << 21)
		| ((bytes[offset + 1] & 0x7f) << 14)
		| ((bytes[offset + 2] & 0x7f) << 7)
		| (bytes[offset + 3] & 0x7f);
};

const readUInt32 = (view, offset, useSyncSafe) => {
	if (useSyncSafe) {
		return readSyncSafeInt([
			view.getUint8(offset),
			view.getUint8(offset + 1),
			view.getUint8(offset + 2),
			view.getUint8(offset + 3)
		], 0);
	}

	return (
		(view.getUint8(offset) << 24)
		| (view.getUint8(offset + 1) << 16)
		| (view.getUint8(offset + 2) << 8)
		| view.getUint8(offset + 3)
	) >>> 0;
};

const decodeText = (bytes, encodingByte) => {
	if (!bytes || !bytes.length) {
		return '';
	}

	try {
		if (encodingByte === 0x00) {
			return new TextDecoder('iso-8859-1').decode(bytes).replace(/\u0000/g, '').trim();
		}

		if (encodingByte === 0x01) {
			if (bytes.length >= 2) {
				const bom0 = bytes[0];
				const bom1 = bytes[1];
				if (bom0 === 0xff && bom1 === 0xfe) {
					return new TextDecoder('utf-16le').decode(bytes.slice(2)).replace(/\u0000/g, '').trim();
				}
				if (bom0 === 0xfe && bom1 === 0xff) {
					const swapped = new Uint8Array(bytes.length - 2);
					for (let i = 2; i + 1 < bytes.length; i += 2) {
						swapped[i - 2] = bytes[i + 1];
						swapped[i - 1] = bytes[i];
					}
					return new TextDecoder('utf-16le').decode(swapped).replace(/\u0000/g, '').trim();
				}
			}

			return new TextDecoder('utf-16le').decode(bytes).replace(/\u0000/g, '').trim();
		}

		if (encodingByte === 0x02) {
			const swapped = new Uint8Array(bytes.length);
			for (let i = 0; i + 1 < bytes.length; i += 2) {
				swapped[i] = bytes[i + 1];
				swapped[i + 1] = bytes[i];
			}
			return new TextDecoder('utf-16le').decode(swapped).replace(/\u0000/g, '').trim();
		}

		return new TextDecoder('utf-8').decode(bytes).replace(/\u0000/g, '').trim();
	} catch {
		return '';
	}
};

const findNullTerminator = (bytes, start, step = 1) => {
	for (let i = start; i < bytes.length; i += step) {
		if (step === 2) {
			if (i + 1 < bytes.length && bytes[i] === 0x00 && bytes[i + 1] === 0x00) {
				return i;
			}
		} else if (bytes[i] === 0x00) {
			return i;
		}
	}

	return -1;
};

const parseApic = (frameBytes) => {
	if (!frameBytes || frameBytes.length < 4) {
		return null;
	}

	const encoding = frameBytes[0];
	let pos = 1;

	const mimeEnd = findNullTerminator(frameBytes, pos);
	if (mimeEnd < 0) {
		return null;
	}
	const mimeTypeRaw = new TextDecoder('iso-8859-1').decode(frameBytes.slice(pos, mimeEnd)).trim();
	pos = mimeEnd + 1;

	if (pos >= frameBytes.length) {
		return null;
	}

	pos += 1; // picture type

	const isUnicode = encoding === 0x01 || encoding === 0x02;
	const descEnd = findNullTerminator(frameBytes, pos, isUnicode ? 2 : 1);
	if (descEnd >= 0) {
		pos = descEnd + (isUnicode ? 2 : 1);
	}

	if (pos >= frameBytes.length) {
		return null;
	}

	const data = frameBytes.slice(pos);
	const mimeType = mimeTypeRaw || 'image/jpeg';
	if (!data.length) {
		return null;
	}

	return { mimeType, data };
};

const parseId3v2 = (arrayBuffer) => {
	const bytes = new Uint8Array(arrayBuffer);
	if (bytes.length < 10) {
		return null;
	}

	if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) {
		return null;
	}

	const version = bytes[3];
	if (version < 2 || version > 4) {
		return null;
	}

	const tagSize = readSyncSafeInt(bytes, 6);
	const totalTagSize = Math.min(bytes.length, tagSize + 10);
	const view = new DataView(arrayBuffer, 0, totalTagSize);

	let offset = 10;
	let title = '';
	let picture = null;

	while (offset + 10 <= totalTagSize) {
		const frameId = String.fromCharCode(
			view.getUint8(offset),
			view.getUint8(offset + 1),
			view.getUint8(offset + 2),
			view.getUint8(offset + 3)
		);

		if (!frameId.trim()) {
			break;
		}

		const frameSize = readUInt32(view, offset + 4, version === 4);
		if (!frameSize || frameSize < 1) {
			break;
		}

		const frameDataStart = offset + 10;
		const frameDataEnd = frameDataStart + frameSize;
		if (frameDataEnd > totalTagSize) {
			break;
		}

		const frameBytes = bytes.slice(frameDataStart, frameDataEnd);
		if (frameId === 'TIT2' && frameBytes.length > 1) {
			title = decodeText(frameBytes.slice(1), frameBytes[0]) || title;
		}

		if (frameId === 'APIC' && !picture) {
			picture = parseApic(frameBytes);
		}

		offset = frameDataEnd;
	}

	return {
		title,
		picture
	};
};

const getFileExtension = (file) => {
	const fileName = String(file?.name || '').toLowerCase();
	const dot = fileName.lastIndexOf('.');
	if (dot < 0 || dot >= fileName.length - 1) {
		return '';
	}
	return fileName.slice(dot + 1);
};

const extractAudioMetadata = async (file) => {
	if (!(file instanceof File)) {
		return null;
	}

	const ext = getFileExtension(file);
	if (!AUDIO_EXTENSIONS.has(ext)) {
		return null;
	}

	if (!file.size) {
		return null;
	}

	try {
		const chunk = file.slice(0, Math.min(file.size, 1024 * 1024 * 2));
		const buffer = await chunk.arrayBuffer();
		const parsed = parseId3v2(buffer);
		if (!parsed) {
			return null;
		}

		const result = {};
		if (parsed.title) {
			result.title = parsed.title;
		}

		if (parsed.picture?.data?.length) {
			const imageBlob = new Blob([parsed.picture.data], { type: parsed.picture.mimeType || 'image/jpeg' });
			result.pictureBlob = imageBlob;
		}

		return Object.keys(result).length ? result : null;
	} catch {
		return null;
	}
};

export {
	extractAudioMetadata
};
