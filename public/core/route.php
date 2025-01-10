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
		$bodyClass = 'page';
		
		switch ($get['module']) {
			case 'collapse':
				$content = file_get_contents(__DIR__.'/pages/collapse.php');
				break;
			case 'form-sender':
				$content = file_get_contents(__DIR__.'/pages/form.php');
				break;
			case 'sidebar':
				$content = file_get_contents(__DIR__.'/pages/sidebar.php');
				break;
			case 'dropdown':
				$content = file_get_contents(__DIR__.'/pages/dropdown.php');
				break;
            case 'modal':
                $content = file_get_contents(__DIR__.'/pages/modal.php');
                break;
			case 'nav':
				$content = file_get_contents(__DIR__.'/pages/nav.php');
				break;
			default:
				$content = file_get_contents(__DIR__.'/pages/home.php');
				break;
		}
	}