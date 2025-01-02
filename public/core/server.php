<?php
	ini_set("display_errors", "1");
	error_reporting(E_ALL);
	
	/**
	 * Created by vegas s.
	 */
	$get = $_GET;

	if (isset($_GET['sidebar'])) {
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
			echo json_encode(['error' => 'false', 'data' => 'Всё прошло успешно']);
		}
		if ($_GET['form'] == 'feedback') {
			echo json_encode(['error' => 'false', 'data' => 'Заявка отправлена']);
		}
		if ($_GET['form'] == 'modal') {
			echo json_encode(['error' => 'false', 'data' => 'Форма из модалки']);
		}
	}
