<div class="container">
	<h1 class="mb-3 mt-3">VGFormSender</h1>
	<hr class="mb-4">

	<div class="row">
		<div class="col-lg-3">
			...
		</div>
		<div class="col-lg-9">
			<h3>Как это работает</h3>
			
			<div class="d-flex mt-5 pb-5">
				<form action="/core/server.php?form=simple" method="POST" class="form" id="form-simple" data-vgformsender>
					<input type="hidden" name="form" value="simple">
					
					<div class="row">
						<div class="col-lg-4 mb-3">
							<label for="name" class="form-label">Ваше имя</label>
							<input type="text" name="name" id="name" class="form-control">
						</div>
						<div class="col-lg-4 mb-3">
							<label for="patronymic" class="form-label">Ваше отчество</label>
							<input type="text" name="patronymic" id="patronymic" class="form-control">
						</div>
						<div class="col-lg-4 mb-3">
							<label for="surname" class="form-label">Ваша фамилия</label>
							<input type="text" name="surname" id="surname" class="form-control">
						</div>
						<div class="col-lg-4 mb-3">
							<label for="auto" class="form-label">Выберите авто</label>
							<select name="auto" id="auto" class="form-select">
								<option value="audi">Audi</option>
								<option value="bmw">BMW</option>
								<option value="Mercedes">Mercedes</option>
								<option value="Renault">Renault</option>
								<option value="Nissan">Nissan</option>
								<option value="Kia">Kia</option>
							</select>
						</div>
						<div class="col-lg-4 mb-3">
							<p class="form-label">Ваш пол</p>
							<div class="form-check form-check-inline">
								<input class="form-check-input" type="radio" name="sex" value="female" id="sex-female">
								<label class="form-check-label" for="sex-female">
									Женский
								</label>
							</div>
							<div class="form-check form-check-inline">
								<input class="form-check-input" type="radio" name="sex" value="male" id="sex-male">
								<label class="form-check-label" for="sex-male">
									Мужской
								</label>
							</div>
						</div>
						<div class="col-lg-4 mb-3">
							<label for="photo" class="form-label">Выберите фото</label>
							<input type="file" name="photo" id="photo" class="form-control">
						</div>
						<div class="col-12 mb-3">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
								<label class="form-check-label" for="flexSwitchCheckDefault">Я на все согласен</label>
							</div>
						</div>
						
						<div class="col-12">
							<button type="submit" class="btn btn-primary" data-spinner="true">
								<span data-text="Сохранить" data-text-send="Минуточку...">Сохранить</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>