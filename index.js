// css классы по умолчанию
import "./app/_utils/scss/default.scss";

// vgsidebar
import "./app/sidebar/scss/vgsidebar.scss";
import VGSidebar from "./app/sidebar/js/vgsidebar";

// dropdowns

function onReady() {
	// vgsidebar
	[...document.querySelectorAll('[data-vg-toggle="sidebar"]')].forEach(function (btn) {
		VGSidebar.makeInit(btn);
	});

	// dropdowns
}

document.addEventListener("DOMContentLoaded", onReady);

export {
	VGSidebar
}