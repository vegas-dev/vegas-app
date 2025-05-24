<?php

	namespace app\models;
	
	use app\core\Database;

	class Sitenavigation extends Database
	{
		protected static $table = 'sitenavigation';

		public static function getMenu()
		{
			return Sitenavigation::query(self::$table, '*', ['parent_id' => 0], 'id', 'ASC')
				->fetchAll()
			;
		}
	}