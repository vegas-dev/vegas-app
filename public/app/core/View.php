<?php
	namespace app\core;

	class View
	{
		public $layout = 'l.php';

		function render($view, $data = []) {
			if(is_array($data)) {
				extract($data);
			}
			
			include 'app/views/layouts/master/'.$this->layout;
		}
	}