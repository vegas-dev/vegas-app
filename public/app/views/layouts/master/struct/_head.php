<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">

<!-- Styles -->
<link href="/assets/build/vgapp.css" rel="stylesheet">
<link href="/assets/css/style.css" rel="stylesheet">

<?php
	if(!empty($style)) {
		echo '<link href="/assets/css/'. $style .'.css" rel="stylesheet">';
	}
?>

<!-- Scripts -->
<script src="/assets/build/vgapp.js"></script>
<script src="/assets/demo/js/script.js"></script>
<script src="/assets/demo/js/listeners.js"></script>
