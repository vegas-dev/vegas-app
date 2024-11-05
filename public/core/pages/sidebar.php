<div class="container">
	<h1 class="mb-3 mt-3">VGSidebar</h1>
	<hr class="mb-4">
	
	<div class="row">
		<div class="col-lg-3">
			<ul class="list-group">
				<li class="list-group-item"><a href="#sidebar-left" data-vg-toggle="sidebar">Открыть панель слева</a></li>
				<li class="list-group-item"><button class="btn btn-primary" data-vg-target="#sidebar-right" data-vg-toggle="sidebar">Открыть панель справа</button></li>
				<li class="list-group-item"><button class="btn btn-primary" data-vg-target="#sidebar-top" data-vg-toggle="sidebar">Открыть панель сверху</button></li>
				<li class="list-group-item"><a href="#sidebar-bottom" data-vg-toggle="sidebar">Открыть панель снизу</a></li>
			</ul>
		</div>
		<div class="col-lg-9">
			<h3>Как это работает</h3>
			<div style="height: 2000px"></div>
		</div>
	</div>
</div>

<div class="vg-sidebar left" id="sidebar-left">
	<div class="vg-sidebar-header">
		<div class="vg-sidebar-header--title">Панель слева</div>
		<button type="button" class="vg-btn-close" data-vg-dismiss="sidebar" data-vg-target="#sidebar-left" aria-label="Close"></button>
	</div>
	<div class="vg-sidebar-body">
		<form action="#" method="get">
			<label for="search" class="form-label">Поиск по сайту</label>
			<input name="search" type="text" class="form-control" id="search">
		</form>
	</div>
	<div class="vg-sidebar-footer"></div>
</div>

<div class="vg-sidebar right" id="sidebar-right" data-params='{"ajax": {"route": "/core/server.php?sidebar=right", "target": "#sidebar-ajax-content"}}'>
	<div class="vg-sidebar-header">
		<div class="vg-sidebar-header--title">Панель справа</div>
		<button type="button" class="vg-btn-close" data-vg-dismiss="sidebar" aria-label="Close"></button>
	</div>
	<div class="vg-sidebar-body">
		<div id="sidebar-ajax-content"></div>
	</div>
	<div class="vg-sidebar-footer">
		<button type="button" class="btn btn-primary" data-vg-dismiss="sidebar" aria-label="Close">Закрыть</button>
	</div>
</div>

<div class="vg-sidebar top" id="sidebar-top" data-backdrop="false" data-overflow="true">
	<div class="vg-sidebar-header">
		<div class="vg-sidebar-header--title">Панель сверху</div>
		<button type="button" class="vg-btn-close" data-vg-dismiss="sidebar" data-vg-target="#sidebar-top" aria-label="Close"></button>
	</div>
	<div class="vg-sidebar-body"></div>
	<div class="vg-sidebar-footer"></div>
</div>

<div class="vg-sidebar bottom" id="sidebar-bottom">
	<div class="vg-sidebar-header">
		<div class="vg-sidebar-header--title">Панель снизу</div>
		<button type="button" class="vg-btn-close" data-vg-dismiss="sidebar" aria-label="Close"></button>
	</div>
	<div class="vg-sidebar-body"></div>
	<div class="vg-sidebar-footer"><a href="#sidebar-bottom" data-vg-dismiss="sidebar">Закрыть</a></div>
</div>

<script>
	const mySidebarLeft = document.getElementById('sidebar-left')
	mySidebarLeft.addEventListener('vg.sidebar.shown', function () {
		mySidebarLeft.querySelector('form input').focus();
	});
</script>