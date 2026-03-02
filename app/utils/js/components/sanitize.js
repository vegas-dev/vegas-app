const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const DEFAULT_ALLOWED_SVG_TAGS = new Set([
	"svg",
	"g",
	"path",
	"line",
	"polyline",
	"polygon",
	"circle",
	"ellipse",
	"rect",
	"defs",
	"symbol",
	"title",
	"use"
]);
const DEFAULT_ALLOWED_SVG_ATTRS = new Set([
	"xmlns",
	"viewbox",
	"width",
	"height",
	"fill",
	"stroke",
	"stroke-width",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-dasharray",
	"stroke-dashoffset",
	"opacity",
	"transform",
	"class",
	"x",
	"y",
	"x1",
	"y1",
	"x2",
	"y2",
	"cx",
	"cy",
	"r",
	"rx",
	"ry",
	"points",
	"d",
	"role",
	"focusable",
	"aria-hidden",
	"href",
	"xlink:href"
]);

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function sanitizeSvgNode(node, allowedTags = DEFAULT_ALLOWED_SVG_TAGS, allowedAttrs = DEFAULT_ALLOWED_SVG_ATTRS) {
	if (!node) {
		return null;
	}

	if (node.nodeType === Node.TEXT_NODE) {
		return document.createTextNode(node.textContent || "");
	}

	if (node.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}

	const tagName = node.tagName.toLowerCase();
	if (!allowedTags.has(tagName)) {
		return null;
	}

	const safeNode = document.createElementNS(SVG_NAMESPACE, tagName);

	Array.from(node.attributes || []).forEach((attr) => {
		const name = attr.name.toLowerCase();
		const attrValue = attr.value || "";

		if (!allowedAttrs.has(name) || name.startsWith("on")) {
			return;
		}

		if ((name === "href" || name === "xlink:href") && attrValue && !attrValue.startsWith("#")) {
			return;
		}

		safeNode.setAttribute(name, attrValue);
	});

	Array.from(node.childNodes || []).forEach((child) => {
		const safeChild = sanitizeSvgNode(child, allowedTags, allowedAttrs);
		if (safeChild) {
			safeNode.append(safeChild);
		}
	});

	return safeNode;
}

export function toSafeHtmlString(value, {
	allowedSvgTags = DEFAULT_ALLOWED_SVG_TAGS,
	allowedSvgAttrs = DEFAULT_ALLOWED_SVG_ATTRS
} = {}) {
	if (value === null || value === undefined) {
		return "";
	}

	const content = String(value).trim();
	if (!content) {
		return "";
	}

	if (!content.includes("<")) {
		return escapeHtml(content);
	}

	const template = document.createElement("template");
	template.innerHTML = content;

	const sanitizedParts = Array.from(template.content.childNodes)
		.map((node) => sanitizeSvgNode(node, allowedSvgTags, allowedSvgAttrs))
		.filter(Boolean)
		.map((node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				return escapeHtml(node.textContent || "");
			}
			if (node.nodeType === Node.ELEMENT_NODE) {
				return node.outerHTML;
			}
			return "";
		});

	const sanitized = sanitizedParts.join("");
	return sanitized || escapeHtml(content);
}

class Sanitize {
	static toSafeHtmlString(value, options) {
		return toSafeHtmlString(value, options);
	}
}

export default Sanitize;
