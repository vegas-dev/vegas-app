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
					<button type="submit" data-vg-toggle="alert" data-message="Внимание! Это будет удалено!" class="btn btn-primary">Удалить</button>
				</form>
			</div>
		</div>
	</div>
</div>

<script>

</script>