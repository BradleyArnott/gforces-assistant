var frontendButtons = function() {

	var devMode = false;
	var loggedIn = false;
	if ($('[rel="stylesheet"][media="all"]').attr('href').indexOf('temp-production') != -1) devMode = true;

	checkLogIn().then(function() {

		var splitest = ($('.vwo_loaded').length >= 1) ? true : false;
		var splitestclass = (splitest) ? ' nd-split-test' : '';
		var markup = '<div class="nd-sidebar">';
		if(devMode && loggedIn) markup += '<div class="nd-button nd-devmode'+splitestclass+'"></div>';
		if(!devMode && loggedIn) markup += '<div class="nd-button'+splitestclass+'"></div>';
		if(!loggedIn) markup += '<div class="nd-button nd-negative"></div>';
		markup += '<div class="nd-menu">';

		if(splitest >= 1) {
			markup += '<div class="nd-item nd-split-test">Split Tests Running</div>';
		}

		markup += '<a class="nd-item" target="_blank" href="/backend">Backend</a>';
		markup += '<a class="nd-item" target="_blank" href="/backend/section/index/">Site Sections</a>';
		markup += '<div class="nd-dropdown nd-item"><div class="nd-item">Templates</div>';
		markup += '<div class="nd-menu">';
		markup += '<a class="nd-item" target="_blank" href="http://master.auto.gforcestestlink.co.uk/">Master</a>';
		markup += '<a class="nd-item" target="_blank" href="http://master.auto.gforcestestlink.co.uk/single-franchise" title="Master - Single Franchise">Master - SF</a>';
		markup += '</div>';
		markup += '</div>';
		markup += '<a class="nd-item" target="_blank" href="/backend/assets/">Assets</a>';
		if(loggedIn) markup += '<a class="nd-item js-deploy-assets" target="_blank" href="#">Deploy</a>';
		if(!loggedIn) markup += '<a class="nd-item nd-negative js-deploy-assets" target="_blank" href="#">Deploy</a>';
		if(devMode && loggedIn) markup += '<a class="nd-item js-dev-mode nd-active" target="_blank" href="/backend/assets/">Dev Mode</a>';
		if(!devMode && loggedIn) markup += '<a class="nd-item js-dev-mode" target="_blank" href="/backend/assets/">Dev Mode</a>';
		if(!loggedIn) markup += '<a class="nd-item nd-negative js-dev-mode" target="_blank" href="/backend/assets/">Dev Mode</a>';
		markup += '</div>';
		markup += '</div>';
		markup += '<div class="nd-message nd-info" style="display: none;">Deploying...</div>';
		markup += '<div class="nd-message nd-negative" style="display: none;">Please Login First</div>';

		$(markup).appendTo($('body'));

		var css = '<style>';
		css += '.nd-sidebar {line-height: normal;font-size:15px;font-family:Arial;right:0;transform: translate(100%, 0);top:50px;position:fixed;z-index:99999999999999999;transition:all .3s;background:#1b1b1b;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}';
		css += '.nd-sidebar.nd-is-open {transform: translate(0, 0);}';
		css += '.nd-button {cursor: pointer;left: -40px;position: absolute;height: 40px;width: 40px;display:block;padding:0;background:#1b1b1b;color:#999;border-radius:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}';
		css += '.nd-button.nd-devmode {background:#4CAF50;}';
		css += '.nd-button.nd-negative {background:#F44336;}';
		css += '.nd-button.nd-split-test {border-bottom: solid 5px #FF9800}';
		css += '.nd-button:before {content:"";display: block;border-top:5px solid transparent;border-right:10px solid #fff;border-bottom:5px solid transparent;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);}';
		css += '.nd-sidebar.nd-is-open .nd-button {transform: rotate(180deg);}';
		css += '.nd-sidebar .nd-menu {padding:0;}';
		css += '.nd-sidebar .nd-item {text-decoration: none;font-size:15px;font-family:Arial;display: block;padding: 5px 10px;color:rgba(255,255,255,.7);}';
		css += '.nd-sidebar a.nd-item:hover {background: rgba(0,0,0,.6)}';
		css += '.nd-sidebar .nd-item + .nd-item {border-top: solid 1px rgba(255,255,255,.2);}';
		css += '.nd-sidebar .nd-item + .nd-menu {border-top: solid 1px rgba(255,255,255,.2);}';
		css += '.nd-sidebar .nd-dropdown .nd-menu .nd-item {padding-left:20px;}';
		css += '.nd-sidebar .nd-dropdown {background: #323232;}';
		css += '.nd-sidebar .nd-item.nd-dropdown {padding: 0;}';
		css += '.nd-sidebar .nd-item.nd-active {background:#4CAF50;color: rgba(255,255,255,.7);}';
		css += '.nd-sidebar .nd-item.nd-negative {background:#F44336;color: rgba(255,255,255,.7);}';
		css += '.nd-sidebar .nd-item.nd-split-test {background:#FF9800; color: rgba(255,255,255,.7); font-size: 11px}';
		css += '.nd-message {position: fixed;z-index:99999999999999999;top:5px;right:7px 15px;padding:5px;border-radius:3px;}';
		css += '.nd-message.nd-negative {background:#f6bab5;border:solid 1px #F44336;color: #F44336;}';
		css += '.nd-message.nd-info {background:#9fcef3;border:solid 1px #2196F3;color: #2196F3;}';
		css += '</style>';

		$(css).appendTo($('head'));

		$('.nd-button').on('click', function() {
			$('.nd-sidebar').toggleClass('nd-is-open');
		});

		$('.js-dev-mode').on('click', function(e){
			e.preventDefault();

			checkLogIn().then(function(){
				if(!loggedIn) {
					$('.nd-negative').show();
					return;
				}
				$.ajax({
		            url: 'http://' + window.location.hostname + '/backend/assets/set-development-mode?mode=' + !devMode,
		            type: 'GET'
		        }).done(function(response) {
					location.reload();
				}).fail(function(jqXHR, textStatus) {
					console.log(jqXHR)
		            return false;
				});

			});

		});

		$('.js-deploy-assets').on('click', function(e){
			e.preventDefault();

			checkLogIn().then(function(){
				if(!loggedIn) {
					$('.nd-negative').show();
					return;
				}
				$.ajax({
		            url: 'http://' + window.location.hostname + '/backend/assets/deploy',
		            type: 'GET'
		        }).done(function(response) {
		        	$('.nd-info').show();
		        	checkDeploy();
				}).fail(function(jqXHR, textStatus) {
					console.log(jqXHR)
		            return false;
				});
			});

		});

	});