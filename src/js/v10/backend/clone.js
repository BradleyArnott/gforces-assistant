cloneButton = {};

cloneButton.init = function() {
	cloneButton.insert().then(function(){
		cloneButton.clickEvents();
	});
}

cloneButton.insert = function() {
	
	return new Promise(function(resolve, reject) {
		$('.module .nd-module-btns').each(function(){
			if(!$(this).find('.js-module-clone').length) $(this).append('<a class="js-module-clone nd-clone nd-module-remove" style="border-radius: 0 0 3px 3px; background: #49ddaa !important; margin-right: 3px !important;" href="#"><i class="nd-icon-plus nd-icon-invert"></i></a>');
		});
		resolve();
	});
}

cloneButton.clickEvents = function() {

	$('body').on('click', '.js-module-clone', function(e) {
		e.preventDefault();

		let $clone = $(this).parent().parent().clone(),
			$item = $clone.insertAfter($(this).parent().parent());
	});
}

cloneButton.init();