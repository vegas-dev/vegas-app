// css классы по умолчанию
import "./app/_utils/scss/default.scss";

// vgsidebar
import "./app/modules/sidebar/scss/vgsidebar.scss";
import VGSidebar from "./app/modules/sidebar/js/vgsidebar";

// dropdown
import "./app/modules/dropdown/scss/vgdropdown.scss";
import VGDropdown from "./app/modules/dropdown/js/vgdropdown";

function onReady() {
	[...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (element) {
		VGDropdown.init(element, {})
	});
}

document.addEventListener('DOMContentLoaded', onReady);

export {
	VGSidebar, VGDropdown
}
