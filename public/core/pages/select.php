<div class="container pb-5">
	<h1 class="mb-3 mt-3">VGSelect</h1>
	<hr class="mb-4">

	<div class="row">
		<div class="col-lg-3">
			...
		</div>
		<div class="col-lg-9">
			<h3 class="mb-5">Как это работает</h3>
			
			<form action="#" method="post" id="form-countries">
				<div class="row">
					<div class="col-lg-3">
						<label for="country" class="d-block mb-2">Выбрать страну</label>
						<select id="country" class="vg-select w-100" name="country" data-max="10" required>
							<option value="2" data-price="1">
								Россия
							</option>
							<option value="3" data-price="2">Узбекистан</option>
							<option value="4" data-price="3">
								Казахстан
							</option>
							<option value="5" data-price="4" selected>
								Белоруссия
							</option>
							<option value="6" data-price="5" disabled>
								Китай
							</option>
						</select>
					</div>
					<div class="col">
						<label for="region" class="d-block mb-2">Выбрать регион</label>
						<select id="region" class="vg-select" name="region" data-search="true" data-route="/php/search.php">
							<option value="1">Московская область</option>
							<option value="2" selected>Ленинградская область</option>
							<option value="3">Калужская область</option>
							<option value="4">Тульская область</option>
							<option value="5" hidden="hidden">Краснодарский край</option>
						</select>
					</div>
					<div class="col">
						<label for="city" class="d-block mb-2">Выбрать город</label>
						<select id="city" data-search="true" class="vg-select" name="city"
								data-placeholder="Надо что-то выбрать..."
								data-ajax-route="/core/server.php?select=ajax"
						>
							<option value="1">Москва</option>
							<option value="2">Подольск</option>
							<option value="3">Мытищи</option>
							<option value="4">Чехов</option>
							<option value="5">Балашиха</option>
							<option value="6">Клин</option>
							<option value="7">Серпухов</option>
							<option value="8">Барвиха</option>
							<option value="9">Химки</option>
							<option value="10">Наро-Фоминск</option>
							<option value="11">Одинцово</option>
							<option value="12">Коммунарка</option>
							<option value="13">Видное</option>
							<option value="14">Королев</option>
							<option value="15">Домодедово</option>
							<option value="16">Зеленоград</option>
						</select>
					</div>
					
					<div class="col-12 mt-3">
						<button type="submit" class="btn btn-primary">Отправить</button>
						<button type="reset" class="btn btn-outline-primary">Сбросить</button>
						<button type="button" class="btn btn-outline-primary" id="add-region">Добавить регион</button>
					</div>
				</div>
			</form>
			
			<form action="#" method="post" class="mt-5" id="form-brands">
				<div class="row">
					<div class="col-lg-4">
						<label class="form-label" for="brand">Бренд</label>
						<select name="brand" class="vg-select w-100" id="brand">
							<option>-</option>
							<option value="nike" data-clothes="2,4">Nike</option>
							<option value="adidas" data-clothes="1,3">Adidas</option>
						</select>
					</div>
					<div class="col-lg-4">
						<label class="form-label" for="clothes">Одежда</label>
						<select name="clothes" class="vg-select w-100" id="clothes" disabled>
							<option>-</option>
							<option value="1" hidden="">Шорты</option>
							<option value="2" hidden>Кроссовки</option>
							<option value="3" hidden>Футболка</option>
							<option value="4" hidden>Носки</option>
							<option value="5" hidden>Перчатки</option>
							<option value="6" hidden>Кеды</option>
						</select>
					</div>
					
					<div class="col-lg-4 ms-auto">
						<label for="color" class="d-block mb-2">Выберите цвет</label>
						<select id="color" class="vg-select w-100" name="color" data-search="true">
							<optgroup label="Цвет">
								<option value="c1">Апельсиновый</option>
								<option value="c2">Лимонный</option>
								<option value="c3">Персиковый</option>
							</optgroup>
							<optgroup label="Тон">
								<option value="s1">Светлый</option>
								<option value="s2">Нормальный</option>
								<option value="s3">Темный</option>
							</optgroup>
						</select>
					</div>
				</div>
			</form>
			
			<div id="form-monitor"></div>
		</div>
	</div>
</div>

<script>
	const MONITOR = document.getElementById('form-monitor');

	/**
	 *
	 */

	let formCountries = document.getElementById('form-countries');
	formCountries.onsubmit = function () {
		let data = new FormData(this);

		let ul = document.createElement('ul');

		for (let [key, value] of data) {
			let li = document.createElement('li');

			li.innerHTML = '<span>Элемент: <b>' + key + '</b></span><span>Выбрано: <b>' + value + '</b></span>'
			ul.append(li);
		}

		MONITOR.append(ul);

		return false;
	}

	/**
	 *
	 */
	let selectBrand = document.getElementById('brand');

	selectBrand.addEventListener('vg.select.change', function (event) {
		let code = document.createElement('code');
		code.innerHTML = event.value;
		code.classList.add('d-block')
		
		MONITOR.append(code);
	});

	selectBrand.addEventListener('change', function (e) {
		let selectClothes = document.getElementById('clothes');
		selectClothes.removeAttribute('disabled');

		let selectedIndex = selectBrand.selectedIndex;
		let option = selectBrand[selectedIndex];
		let clothesIds = (option.dataset.clothes || '').split(',');

		[...selectClothes.querySelectorAll('option')].forEach(function (option) {
			let vis = clothesIds.indexOf(option.value) !== -1;
			if (vis) {
				option.removeAttribute('hidden');
			} else {
				option.hidden = true;
			}
		});
	});

	/**
	 *
	 */
	setTimeout(() => {
		let opt = document.createElement('option');
		opt.innerText = 'Puma';
		opt.setAttribute('value', 'puma');
		opt.setAttribute('data-clothes', '5,6');

		selectBrand.append(opt)
	}, 1000);

	/**
	 *
	 */
	const region = document.getElementById('region');

	setTimeout(() => {
		let opt = document.createElement('option');
		opt.innerText = 'Смоленская область';
		opt.setAttribute('value', '6');

		region.append(opt)
	}, 10000)
	
	document.getElementById('add-region').addEventListener('click', function () {
		let opt = document.createElement('option');
		opt.innerText = 'Липецкая область';
		opt.setAttribute('value', '7');

		region.append(opt)
	});
</script>