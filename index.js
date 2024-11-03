// css классы по умолчанию
import "./app/_utils/scss/default.scss";

// vgsidebar
import "./app/sidebar/scss/vgsidebar.scss";
import VGSidebar from "./app/sidebar/js/vgsidebar";

// vgdropdown
import "./app/dropdown/scss/vgdropdown.scss";
import VGDropdown from "./app/dropdown/js/vgdropdown";

function onReady() {
	// vgsidebar
	[...document.querySelectorAll('[data-vg-toggle="sidebar"]')].forEach(function (btn) {
		VGSidebar.makeInit(btn);
	});

	// dropdowns
	[...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (btn) {
		VGDropdown.makeInit(btn);
	});
}

document.addEventListener("DOMContentLoaded", onReady);

export {
	VGSidebar, VGDropdown
}