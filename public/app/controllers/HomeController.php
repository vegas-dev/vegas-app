<?php
	namespace app\controllers;

	class HomeController extends BaseController
	{
		public static function index() {
			$_this = new HomeController();
			$_this->view->render('home/index.php', ['style' => '_hero']);
		}
	}