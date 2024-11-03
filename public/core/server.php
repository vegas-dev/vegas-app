<?php
	ini_set("display_errors", "1");
	error_reporting(E_ALL);
	
	/**
	 * Created by vegas s.
	 */
	$get = $_GET;

	if (isset($_GET['sidebar'])) {
		if ($_GET['sidebar'] == 'right') {
			echo 'Привет мир справа';
		}
		if ($_GET['sidebar'] == 'top') {
			echo 'Привет мир сверху';
		}
	}
