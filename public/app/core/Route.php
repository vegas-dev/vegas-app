<?php
	namespace app\core;

	class Route
	{
		private $routes = [];
		
		public function add($method, $path, $handler) {
			$this->routes[] = compact('method', 'path', 'handler');
		}
		
		public function dispatch($requestUri, $requestMethod) {
			foreach ($this->routes as $route) {
				$params = [];
				if ($route['method'] === strtoupper($requestMethod) && $this->match($route['path'], $requestUri, $params)) {
					call_user_func_array($route['handler'], $params);
					return;
				}
			}

			http_response_code(404);
			echo "404 Нет такой страницы";
		}

		private function match($routePath, $requestUri, &$params) {
			$routePattern = preg_replace('/\{([\w]+)\}/', '(?P<$1>[^/]+)', $routePath);
			$routePattern = '#^' . $routePattern . '$#';
			
			if (preg_match($routePattern, $requestUri, $matches)) {
				$params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
				return true;
			}
			return false;
		}
		
		public static function get($uri, $controller, $action = 'index') {
			$router = new Route();
			$router->add('GET', $uri, [$controller, $action]);
			$router->send();
		}

		public static function post($uri, $controller, $action = 'index') {
			$router = new Route();
			$router->add('GET', $uri, [$controller, $action]);
			$router->send();
		}

		private function send() {
			$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
			$requestMethod = $_SERVER['REQUEST_METHOD'];
			$this->dispatch($requestUri, $requestMethod);
		}
	}