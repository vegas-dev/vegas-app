<?php
	use app\composer\Header;
	use app\controllers\HomeController;
	use app\core\Route;

	require 'core/route.php';
	require 'core/view.php';
	require 'core/database.php';

	require 'models/sitenavigation.php';
	require 'composer/header.php';

	require 'controllers/BaseController.php';
	require 'controllers/HomeController.php';
	
	
	/**
	 * Маршруты
	 */
	Route::get('/', HomeController::class);
	
	/**
	 *
	 */
	Header::composer($path_views.'layouts/master/header/header.php');