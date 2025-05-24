<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Vegas APP</title>
	<?php include('app/views/layouts/master/struct/_head.php') ?>
</head>
<body class="">
<div class="wrapper">
	<?php include('app/views/layouts/master/header/header.php') ?>
	
	<main class="main">
		<?php include 'app/views/'.$view; ?>
	</main>
</div>
<?php include('app/views/layouts/master/struct/_law_cookie.php') ?>
</body>
</html>