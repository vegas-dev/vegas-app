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
				<a href="#toast-danger-delete" class="btn btn-danger" id="toastBtnDanger">Удалить</a>
				<a href="#toast-danger-delete" class="btn btn-danger" id="toastBtnDark">Удалить</a>
			</div>
		</div>
	</div>
</div>

<script>
	const myToast = vg.VGToast;
	
	const toastTrigger = document.getElementById('toastBtnLive');
	if (toastTrigger) {
		toastTrigger.addEventListener('click', () => {
			myToast.run(['Спасибо за внимание', 'Успешно удалено']);
		});
	}
	
	const toastTriggerDanger = document.getElementById('toastBtnDanger');
	if (toastTriggerDanger) {
		toastTriggerDanger.addEventListener('click', () => {
			myToast.run(['Спасибо за понимание', 'Не удалось удалить'], {theme: 'danger'});
		});
	}
	
	const toastTriggerDark = document.getElementById('toastBtnDark');
	if (toastTriggerDark) {
		toastTriggerDark.addEventListener('click', () => {
			myToast.run(['Успешно удалено'], {
				animation: {
					in: 'animate__zoomInDown',
					out: 'animate__zoomOutDown'
				}
			});
		});
	}
</script>