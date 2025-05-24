<?php
	
	namespace app\core;
	
	use PDO;
	use PDOException;
	
	class Database
	{
		protected static $table;
		private $host = "MySQL-8.0";
		private $db_name = "vegas-app";
		private $username = "root";
		private $password = "";
		public $pdo;
		
		public function connection()
		{
			$this->pdo = null;
			
			try {
				$this->pdo = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
			} catch (PDOException $exception) {
				echo "Ошибка соединения: " . $exception->getMessage();
			}
			
			return $this->pdo;
		}
		
		public static function query($table, $select = '*', $where = [], $order = 'id', $order_type = 'DESC', $limit = null, $offset = null) {
			$db = new Database();
			$db->connection();

			$query = 'SELECT '. $select .' FROM '. $table;

			if (count($where) > 0) {
				$query .= ' WHERE ';
				
				foreach ($where as $key => $value) {
					$query .=  $key .'='. $value;
				}
			}
			$query .= ' ORDER BY '.$order.' '.$order_type;

			return $db->pdo->query($query);
		}
	}