<?php
	namespace app\controllers;
	use app\core\View;
	
	class BaseController
	{
		public $model;
		public $view;
		
		function __construct()
		{
			$this->view = new View();
		}
	}