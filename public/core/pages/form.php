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
			
			<div class="mt-5">
				<form action="/core/server.php?form=feedback" method="POST" data-validate="true" id="form-feedback" data-vgformsender>
					<input type="hidden" name="form" value="feedback">
					
					<div class="row">
						<div class="col-lg-4 mb-3">
							<label for="user-name" class="form-label">Ваше имя <sup class="text-danger">*</sup></label>
							<input type="text" name="user-name" id="user-name" class="form-control" required>
						</div>
						<div class="col-lg-4 mb-3">
							<label for="user-email" class="form-label">Ваше email <sup class="text-danger">*</sup></label>
							<input type="email" name="user-email" id="user-email" class="form-control" required>
						</div>
						<div class="col-lg-4 mb-3">
							<label for="user-phone" class="form-label">Ваш телефон <sup class="text-danger">*</sup></label>
							<input type="text" name="user-phone" id="user-phone" class="form-control" required>
						</div>
						
						<div class="col-12 mb-3">
							<label for="user-message" class="form-label">Ваше письмо <sup class="text-danger">*</sup></label>
							<textarea name="user-message" id="user-message" class="form-control" required></textarea>
						</div>
						
						<div class="col-12">
							<button type="submit" class="btn btn-primary"><span>Заказать</span></button>
						</div>
					</div>
				</form>
			</div>
			
			<div class="mt-5">
				<a href="#modal-form" class="btn btn-primary" data-bs-toggle="modal">Открыть форму в bs модалке</a>
				<a href="#exampleModal" class="btn btn-danger" data-vg-toggle="modal">Открыть форму в vg модалке</a>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal-form">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Обычная форма в модалке</h4>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<form action="/core/server.php?form=modal" method="post" data-show-pass="true" id="form-in-modal" data-vgformsender>
					<div class="row">
						<div class="col-12">
							<div class="form-floating mb-3">
								<input type="password" name="user-cr-pass" class="form-control" id="user-cr-pass" placeholder="Ваш текущий пароль">
								<label for="user-cr-pass">Ваш текущий пароль</label>
							</div>
						</div>
						<div class="col-12">
							<div class="form-floating mb-3">
								<input type="password" name="user-new-pass" class="form-control" id="user-new-pass" placeholder="Придумайте новый пароль">
								<label for="user-new-pass">Придумайте новый пароль</label>
							</div>
						</div>
						<div class="col-12">
							<div class="form-floating mb-3">
								<input type="password" name="user-re-pass" class="form-control" id="user-re-pass" placeholder="Повторите новый пароль">
								<label for="user-re-pass">Повторите новый пароль</label>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button class="btn btn-outline-light" type="submit" data-spinner="true" form="form-in-modal"><span data-text="Вперед" data-text-send="Что там происходит...">Вперед</span></button>
			</div>
		</div>
	</div>
</div>

<div class="vg-modal" id="exampleModal" tabindex="-1" aria-hidden="true">
	<div class="vg-modal-dialog vg-modal-dialog-centered">
		<div class="vg-modal-content">
			<button type="button" class="vg-btn-close" data-vg-dismiss="modal" data-vg-target="#modal"
					aria-label="Close"></button>
			<div class="vg-modal-header">
				<h1 class="modal-title fs-5" id="exampleModalLabel">New message</h1>
			</div>
			<div class="vg-modal-body">
				<form action="/core/server.php?form=modal" method="post" id="form-in-vg-modal" data-vgformsender>
					<div class="row">
						<div class="col-12">
							<div class="form-floating mb-3">
								<input type="password" name="vg-user-cr-pass" class="form-control" id="vg-user-cr-pass" placeholder="Ваш текущий пароль">
								<label for="vg-user-cr-pass">Ваш текущий пароль</label>
							</div>
						</div>
						<div class="col-12">
							<div class="form-floating mb-3">
								<input type="password" name="vg-user-new-pass" class="form-control" id="vg-user-new-pass" placeholder="Придумайте новый пароль">
								<label for="vg-user-new-pass">Придумайте новый пароль</label>
							</div>
						</div>
						<div class="col-12">
							<div class="form-floating mb-3">
								<input type="password" name="vg-user-re-pass" class="form-control" id="vg-user-re-pass" placeholder="Повторите новый пароль">
								<label for="user-re-pass">Повторите новый пароль</label>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="vg-modal-footer d-flex justify-content-between">
				<button type="button" data-vg-dismiss="modal" aria-label="Close" class="btn btn-primary">закрыть</button>
				<button class="btn btn-danger" type="submit" data-spinner="true" form="form-in-vg-modal"><span data-text="Вперед" data-text-send="Что там происходит...">Вперед</span></button>
			</div>
		</div>
	</div>
</div>