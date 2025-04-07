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
			
			<div class="mt-5">
				<a href="#toast-error-delete" class="btn btn-danger" id="toastBtnDanger">Удалить</a>
			</div>
			
			<div class="mt-5">
				<a href="#toast-info-delete" class="btn btn-info" id="toastBtnInfo">Удалить</a>
			</div>
		</div>
	</div>
</div>

<div class="vg-toast bottom center" data-type="success" id="toast-success-delete">
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

<div class="vg-toast bottom center" data-type="error" id="toast-error-delete">
	<div class="vg-toast-wrapper">
		<div class="vg-toast-icon"></div>
		<div class="vg-toast-content">
			<div class="vg-toast-header">Удаление</div>
			<div class="vg-toast-body">Не удалось удалить товар из корзины</div>
		</div>
		<div class="vg-toast-button">
			<button class="vg-btn-close" data-vg-dismiss="toast"></button>
		</div>
	</div>
</div>

<div class="vg-toast bottom center" data-type="info" id="toast-info-delete">
	<div class="vg-toast-wrapper">
		<div class="vg-toast-icon"></div>
		<div class="vg-toast-content">
			<div class="vg-toast-header">О! Удаление</div>
			<div class="vg-toast-body">Информируем об удалении</div>
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
	
	const toastTriggerDanger = document.getElementById('toastBtnDanger')
	const toastErrorExample = document.getElementById('toast-error-delete')

	if (toastTriggerDanger) {
		const toastVG = vg.VGToast.getOrCreateInstance(toastErrorExample)
		toastTriggerDanger.addEventListener('click', () => {
			toastVG.show();
		})
	}
	
	const toastTriggerInfo = document.getElementById('toastBtnInfo')
	const toastInfoExample = document.getElementById('toast-info-delete')

	if (toastTriggerInfo) {
		const toastVG = vg.VGToast.getOrCreateInstance(toastInfoExample)
		toastTriggerInfo.addEventListener('click', () => {
			toastVG.show();
		})
	}
</script>