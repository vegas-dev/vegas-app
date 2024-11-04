/*// css классы по умолчанию
import "./app/_utils/scss/default.scss";

// vgsidebar
import "./app/sidebar/scss/vgsidebar.scss";
import VGSidebar from "./app/sidebar/js/vgsidebar";

// vgdropdown*/
import "./app/modules/dropdown/scss/vgdropdown.scss";
import VGDropdown from "./app/modules/dropdown/js/vgdropdown";
import Selectors from "./app/_utils/js/selectors";


function onReady() {
	// vgsidebar
	/*[...document.querySelectorAll('[data-vg-toggle="sidebar"]')].forEach(function (btn) {
		VGSidebar.makeInit(btn);
	});*/

	// dropdowns
	[...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (btn) {
		VGDropdown.makeInit(btn);
	});
}

document.addEventListener("DOMContentLoaded", onReady);

/*
export {
	VGSidebar, VGDropdown
}*/
