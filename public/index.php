<?php global $content, $bodyClass;
	include('./core/route.php') ?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Vegas APP</title>
	<?php include('./core/includes/_head.php') ?>
</head>
<body class="<?php echo $bodyClass ?>">
	<div class="wrapper">
		<?php include('./core/includes/_header.php') ?>
		<main class="main">
			<?php echo $content ?>
		</main>
	</div>
	
	<div class="vg-sidebar top" id="sidebar-nav">
		<div class="vg-sidebar-body">
		
		</div>
		<div class="vg-sidebar-footer"></div>
	</div>
</body>
</html>
