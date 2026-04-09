const VIDEO_EXTENSIONS = new Set([
	'mp4',
	'webm',
	'mov',
	'mkv',
	'avi',
	'm4v',
	'ogv'
]);

const getFileExtension = (file) => {
	const fileName = String(file?.name || '').toLowerCase();
	const dot = fileName.lastIndexOf('.');
	if (dot < 0 || dot >= fileName.length - 1) {
		return '';
	}
	return fileName.slice(dot + 1);
};

const waitEvent = (node, eventName) => new Promise((resolve, reject) => {
	const onResolve = () => {
		cleanup();
		resolve(true);
	};

	const onReject = () => {
		cleanup();
		reject(new Error(eventName));
	};

	const cleanup = () => {
		node.removeEventListener(eventName, onResolve);
		node.removeEventListener('error', onReject);
	};

	node.addEventListener(eventName, onResolve, { once: true });
	node.addEventListener('error', onReject, { once: true });
});

const seekVideo = (video, time) => new Promise((resolve, reject) => {
	const onSeeked = () => {
		cleanup();
		resolve(true);
	};

	const onError = () => {
		cleanup();
		reject(new Error('seek'));
	};

	const cleanup = () => {
		video.removeEventListener('seeked', onSeeked);
		video.removeEventListener('error', onError);
	};

	video.addEventListener('seeked', onSeeked, { once: true });
	video.addEventListener('error', onError, { once: true });
	video.currentTime = time;
});

const canvasToBlob = (canvas, type = 'image/jpeg', quality = 0.92) => new Promise((resolve) => {
	canvas.toBlob((blob) => resolve(blob || null), type, quality);
});

const extractVideoMetadata = async (file) => {
	if (!(file instanceof File)) {
		return null;
	}

	const ext = getFileExtension(file);
	const isVideoType = String(file.type || '').toLowerCase().startsWith('video/');
	if (!isVideoType && !VIDEO_EXTENSIONS.has(ext)) {
		return null;
	}

	if (!file.size) {
		return null;
	}

	let objectUrl = '';
	try {
		objectUrl = URL.createObjectURL(file);

		const video = document.createElement('video');
		video.preload = 'metadata';
		video.muted = true;
		video.playsInline = true;
		video.crossOrigin = 'anonymous';
		video.src = objectUrl;

		await waitEvent(video, 'loadedmetadata');

		const width = Number(video.videoWidth || 0);
		const height = Number(video.videoHeight || 0);
		const duration = Number(video.duration || 0);

		if (!width || !height || !Number.isFinite(width) || !Number.isFinite(height)) {
			return {
				duration: Number.isFinite(duration) ? duration : 0,
				width: 0,
				height: 0
			};
		}

		const seekTime = duration > 1 ? Math.min(1, Math.max(0, duration / 2)) : 0;
		await seekVideo(video, seekTime);

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return {
				duration: Number.isFinite(duration) ? duration : 0,
				width,
				height
			};
		}

		ctx.drawImage(video, 0, 0, width, height);
		const posterBlob = await canvasToBlob(canvas, 'image/jpeg', 0.92);

		return {
			duration: Number.isFinite(duration) ? duration : 0,
			width,
			height,
			posterBlob: posterBlob || null
		};
	} catch {
		return null;
	} finally {
		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
		}
	}
};

export {
	extractVideoMetadata
};
