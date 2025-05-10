function onReady() {
	console.log('App ready');

	// VGNav
	[...document.querySelectorAll('.vg-nav')].forEach(el => {
		vg.VGNav.init(el);
	});

	// VGDropdown
	[...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(el => {
		vg.VGDropdown.init(el);
	});

	// VGFromSender
	[...document.querySelectorAll('[data-vgformsender]')].forEach(el => {
		vg.VGFormSender.init(el);
	});

	// VGRollup
	[...document.querySelectorAll(('[data-vgrollup]'))].forEach(el => {
		vg.VGRollup.init(el);
	});

	// VGLawCookie
	let targetLawCookie = document.getElementById('vg-lawcookie');
	if (targetLawCookie) {
		vg.VGLawCookie.init(targetLawCookie);
	}

	// VGSelect
	[... document.querySelectorAll('select.vg-select')].forEach(el => {
		vg.VGSelect.init(el);
	});

	// VGToast
	//vg.VGToast.init()

	// VGDataTable
	[... document.querySelectorAll('.vg-datatable')].forEach(el => {
		vg.VGDataTable.init(el);
	});
}

document.addEventListener('DOMContentLoaded', onReady);