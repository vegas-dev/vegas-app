<div class="container pb-5">
	<h1 class="mb-3 mt-3">VGAlert</h1>
	<hr class="mb-4">

	<div class="row">
		<div class="col-lg-3">
			...
		</div>
		<div class="col-lg-9">
			<h3 class="mb-5">Как это работает</h3>
			
			<div class="mt-5">
				<form action="/?module=alert" method="get" data-vgformsender data-alert-type="collapse" data-response='{"enabled": true, "title": "Все ништяк", "message": "Запись успешно удалена"}'>
					<input type="hidden" name="module" value="alert">
					<input type="hidden" name="remove" value="true">
					<button type="submit" data-vg-toggle="alert" data-message="Внимание! Это будет удалено!" data-elements='{"button": "В пизду"}' class="btn btn-primary">
						<span data-text="Удалить" data-text-send="Удаляем..">Удалить</span>
					</button>
				</form>
				
				<form action="/?module=alert" method="get" id="form-alert" class="mt-3">
					<input type="hidden" name="module" value="alert">
					<input type="hidden" name="remove" value="false">
					<button type="submit" class="btn btn-primary">
						<span data-text="Удалить" data-text-send="Удаляем..">Удалить</span>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<script>
	alert('Суууука');
	
	document.getElementById('form-alert').addEventListener('submit', function (e) {
		e.preventDefault();
		
		vg.VGAlert.run('поехали', this).then((resolve) => {
			console.log('sdfsd')
		}).catch(function (reject) {
			console.log('sdfsd')
		})
	});
</script>