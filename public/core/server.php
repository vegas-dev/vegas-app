<?php
	ini_set("display_errors", "1");
	error_reporting(E_ALL);
	
	/**
	 * Created by vegas s.
	 */
	$get = $_GET;

	if (isset($_GET['sidebar'])) {
		sleep(2);
		if ($_GET['sidebar'] == 'right') {
			echo 'Привет мир справа';
		}
		if ($_GET['sidebar'] == 'top') {
			echo 'Привет мир сверху';
		}
	}

	if (isset($_GET['drop'])) {
		if ($_GET['drop'] == 'list') {
			echo '<ul class="list-group">
							<li class="list-group-item"><a href="#">Список загружен</a></li>
							<li class="list-group-item"><a href="#">Главная</a></li>
							<li class="list-group-item"><a href="#">Услуги</a></li>
							<li class="list-group-item"><a href="#">О компании</a></li>
							<li class="list-group-item"><a href="#">Контакты</a></li>
						</ul>';
		}
	}
	
	if (isset($_GET['form'])) {
		sleep(2);
		
		if ($_GET['form'] == 'simple') {
			echo json_encode(['errors' => 'false', 'view' => ['title' => 'Всё прошло успешно', 'message' => 'Ваша заявка отправлена, очень скоро мы с Вами свяжемся']]);
		}
		if ($_GET['form'] == 'feedback') {
			echo json_encode(['errors' => 'false', 'view' => 'Заявка отправлена']);
		}
		if ($_GET['form'] == 'modal') {
			echo json_encode(['errors' => 'false', 'view' => 'Форма из модалки']);
		}
	}
	
	if (isset($_GET['collapse'])) {
		sleep(2);
		
		if ($_GET['collapse'] == 'ajax') {
			echo '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum debitis deserunt dolore ipsa iure maiores neque odit, optio placeat praesentium quam, quasi quo.</p><p>Consequatur neque nulla praesentium quisquam similique?</p>';
		}
	}
	
	if (isset($_GET['modal'])) {
		sleep(2);
		
		if ($_GET['modal'] == 'ajax') {
			echo '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum debitis deserunt dolore ipsa iure maiores neque odit, optio placeat praesentium quam, quasi quo.</p><p>Consequatur neque nulla praesentium quisquam similique?</p>';
		}
	}