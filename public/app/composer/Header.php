<?php
	namespace app\composer;
	use app\models\Sitenavigation;
	
	class Header
	{
		public static function composer($file)
		{
			$items = Sitenavigation::getMenu();
			
		}
	}