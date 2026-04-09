import ImageFilePreviewRenderer from "./image";
import OfficeFilePreviewRenderer from "./office";
import PdfFilePreviewRenderer from "./pdf";
import TextFilePreviewRenderer from "./text";
import VideoFilePreviewRenderer from "./video";
import ZipFilePreviewRenderer from "./zip";

const createFilePreviewRenderers = () => {
	return [
		new ImageFilePreviewRenderer(),
		new VideoFilePreviewRenderer(),
		new PdfFilePreviewRenderer(),
		new OfficeFilePreviewRenderer(),
		new ZipFilePreviewRenderer(),
		new TextFilePreviewRenderer()
	];
};

export default createFilePreviewRenderers;
