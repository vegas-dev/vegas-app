<?php
ini_set("display_errors", "1");
error_reporting(E_ALL);

/**
 * Created by vegas s.
 */
$get = $_GET;
$content = file_get_contents(__DIR__.'/pages/home.php');
$bodyClass = '';

if (isset($get['module'])) {
	switch ($get['module']) {
		case 'sidebar':
			$content = file_get_contents(__DIR__.'/pages/sidebar.php');
			$bodyClass = 'page';
		break;
		default:
			$content = file_get_contents(__DIR__.'/pages/home.php');
		break;
	}
}

if (isset($_GET['sidebar'])) {
	if ($_GET['sidebar'] == 'right') {
		echo 'Привет мир справа';
	}
	if ($_GET['sidebar'] == 'top') {
		echo 'Привет мир сверху';
	}
}