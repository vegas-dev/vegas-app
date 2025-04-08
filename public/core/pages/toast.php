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

<script>
	const toastTrigger = document.getElementById('toastBtnLive');
	if (toastTrigger) {
		toastTrigger.addEventListener('click', () => {
			vg.VGToast.run('Успешно удалено').show();
		});
	}
</script>