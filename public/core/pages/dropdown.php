<div class="container">
	<h1 class="mb-3 mt-3">VGDropdown</h1>
	<hr class="mb-4">

	<div class="row">
		<div class="col-lg-3">
			...
		</div>
		<div class="col-lg-9">
			<h3>Как это работает</h3>
			
			<div class="d-flex mt-5 pb-5">
				<div class="vg-dropdown">
					<a href="#" class="btn btn-primary" data-vg-toggle="dropdown" data-keyboard="true">Открыть дроп</a>
					<div class="vg-dropdown-content">
						<ul class="list-group">
							<li class="list-group-item"><a href="#">Главная</a></li>
							<li class="list-group-item"><a href="#">Услуги</a></li>
							<li class="list-group-item"><a href="#">О компании</a></li>
							<li class="list-group-item"><a href="#">Контакты</a></li>
						</ul>
					</div>
				</div>
				<div class="vg-dropdown ms-2">
					<a href="#" class="btn btn-danger" data-vg-toggle="dropdown" data-params='{"ajax": {"route": "#", "target": "#drop-content"}}'>Открыть дроп</a>
					<div class="vg-dropdown-content">
						<div id="drop-content"></div>
					</div>
				</div>
				<div class="vg-dropdown ms-2">
					<a href="#" class="btn btn-warning" data-vg-toggle="dropdown">Открыть дроп</a>
					<div class="vg-dropdown-content">
						<ul class="list-group">
							<li class="list-group-item"><a href="#">Главная</a></li>
							<li class="list-group-item"><a href="#">Услуги</a></li>
							<li class="list-group-item"><a href="#">О компании</a></li>
							<li class="list-group-item"><a href="#">Контакты</a></li>
						</ul>
					</div>
				</div>
			</div>
			<p class="mt-3">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem corporis deserunt dicta eveniet nulla
				saepe tempore? Accusantium aperiam consectetur corporis distinctio dolor dolore ducimus eius eos est
				fuga fugiat id in ipsa iure maiores, modi molestiae, officia pariatur provident qui sequi suscipit
				tempora ut! Aliquid doloremque eveniet harum libero quis?
			</p>
		</div>
	</div>
</div>