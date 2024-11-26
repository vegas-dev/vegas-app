// css классы по умолчанию
import "./app/_utils/scss/default.scss";

// vgsidebar
import "./app/modules/sidebar/scss/vgsidebar.scss";
import VGSidebar from "./app/modules/sidebar/js/vgsidebar";

// dropdown
import "./app/modules/dropdown/scss/vgdropdown.scss";
import VGDropdown from "./app/modules/dropdown/js/vgdropdown";

// modal
import "./app/modules/modal/scss/vgmodal.scss";
import VgModal from "./app/modules/modal/js/vgmodal";


function onReady() {
	[...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (element) {
		VGDropdown.init(element, {})
	});
}

document.addEventListener('DOMContentLoaded', onReady);
console.log(1)

export {
	VGSidebar, VGDropdown, VgModal
}
