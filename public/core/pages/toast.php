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
				<a href="#toast-danger-delete" class="btn btn-danger" id="toastBtnDark">Удалить</a>
			</div>
			
			<table class="table table-striped mt-5" id="toast-table-static">
				<tr>
					<td>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="checkDefault_1">
							<label class="form-check-label" for="checkDefault_1">
								Default checkbox
							</label>
						</div>
					</td>
					<td>
						Lorem ipsum dolor sit amet, consectetur adipisicing.
					</td>
				</tr>
				<tr>
					<td>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="checkDefault_2">
							<label class="form-check-label" for="checkDefault_2">
								Default checkbox
							</label>
						</div>
					</td>
					<td>
						Lorem ipsum dolor sit amet, consectetur adipisicing.
					</td>
				</tr>
				<tr>
					<td>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="checkDefault_3">
							<label class="form-check-label" for="checkDefault_3">
								Default checkbox
							</label>
						</div>
					</td>
					<td>
						Lorem ipsum dolor sit amet, consectetur adipisicing.
					</td>
				</tr>
				<tr>
					<td>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="checkDefault_4">
							<label class="form-check-label" for="checkDefault_4">
								Default checkbox
							</label>
						</div>
					</td>
					<td>
						Lorem ipsum dolor sit amet, consectetur adipisicing.
					</td>
				</tr>
				<tr>
					<td>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="checkDefault_5">
							<label class="form-check-label" for="checkDefault_5">
								Default checkbox
							</label>
						</div>
					</td>
					<td>
						Lorem ipsum dolor sit amet, consectetur adipisicing.
					</td>
				</tr>
			</table>
		</div>
	</div>
	
	<div class="vg-toast vg-toast-dark bottom center" id="toast-static-table">
		<div class="vg-toast-wrapper">
			<div class="vg-toast-content">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="checkDefault">
					<label class="form-check-label" for="checkDefault">
						Выбрать все элементы
					</label>
				</div>
			</div>
			<div class="vg-toast-button">
				<button class="vg-btn-close" data-vg-dismiss="toast"></button>
			</div>
		</div>
	</div>
</div>

<script>
	const myToast = vg.VGToast;
	
	const toastTriggerDark = document.getElementById('toastBtnDark');
	if (toastTriggerDark) {
		toastTriggerDark.addEventListener('click', () => {
			myToast.run('Успешно удалено', {stack: {enable: true, max: 3}, autohide: true});
		});
	}
	
	let trInputs = [... document.querySelectorAll(('#toast-table-static input[type="checkbox"]'))];

	trInputs.forEach(el => {
		el.addEventListener('change', function () {
			myToast.getOrCreateInstance('#toast-static-table', {enableClickToast: false, enableButtonClose: true}).show(this);
		})
	});
</script>