<div class="container pb-5">
	<h1 class="mb-3 mt-3">VGToast</h1>
	<hr class="mb-4">

	<div class="row">
		<div class="col-lg-3">
			...
		</div>
		<div class="col-lg-9">
			<h3 class="mb-5">Как это работает</h3>
			
			<div class="mt-5">
				<a href="#toast-success-delete" class="btn btn-primary" id="toastBtnLive">Удалить</a>
			</div>
		</div>
	</div>
</div>

<div class="vg-toast top right" data-type="success" id="toast-success-delete">
	<div class="vg-toast-wrapper">
		<div class="vg-toast-icon"></div>
		<div class="vg-toast-content">
			<div class="vg-toast-header">Удаление</div>
			<div class="vg-toast-body">Товар из корзины успешно удален</div>
		</div>
		<div class="vg-toast-button">
			<button class="vg-btn-close" data-vg-dismiss="toast"></button>
		</div>
	</div>
</div>

<script>
	const toastTrigger = document.getElementById('toastBtnLive')
	const toastLiveExample = document.getElementById('toast-success-delete')

	if (toastTrigger) {
		const toastVG = vg.VGToast.getOrCreateInstance(toastLiveExample)
		toastTrigger.addEventListener('click', () => {
			toastVG.show();
		})
	}
</script>