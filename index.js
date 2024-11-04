// css классы по умолчанию
import "./app/_utils/scss/default.scss";
import Selectors from "./app/_utils/js/selectors";

// vgsidebar
import "./app/modules/sidebar/scss/vgsidebar.scss";
import VGSidebar from "./app/modules/sidebar/js/vgsidebar";

// vgdropdown
import "./app/modules/dropdown/scss/vgdropdown.scss";
import VGDropdown from "./app/modules/dropdown/js/vgdropdown";


function onReady() {
	// vgsidebar
	[...Selectors.findAll('[data-vg-toggle="sidebar"]')].forEach(function (btn) {
		VGSidebar.makeInit(btn);
	});

	let sidebar = document.querySelector('[data-vg-target="#sidebar-right"]');
	VGSidebar.getOrCreateInstance(sidebar).toggle();

	// dropdowns
	[...Selectors.findAll('[data-vg-toggle="dropdown"]')].forEach(function (btn) {
		//VGDropdown.makeInit(btn);
	});
}

document.addEventListener("DOMContentLoaded", onReady);

/*
export {
	VGSidebar, VGDropdown
}*/
