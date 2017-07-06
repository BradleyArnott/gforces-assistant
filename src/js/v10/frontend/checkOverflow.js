var overflow = {};

overflow.get = function() {
	$('.gforces-assistant--overlay--confirm').remove();

	return new Promise(function(resolve, reject) {
		var docWidth = document.documentElement.offsetWidth,
			naughtyList = {},
            id = 0;

		$('*').each(function() {
			if ($(this)[0].offsetWidth > docWidth) {
				naughtyList[$(this)[0].classList.value] = {
	                id: id,
	                el: $(this),
	                value: $(this)[0].classList.value,
	            };
	            id++;
			}
		});
		resolve(naughtyList);
	});
}

overflow.present = function(modules) {
    var modal = $('<div class="gforces-assistant--slashes"><a href="#" class="close">X</a><div class="title">Overflowing Content:</div></div>');

    if ($.isEmptyObject(modules)) {
        var overlayConfirm = $('<div class="gforces-assistant--overlay--confirm"><div class="box"></div></div>');
        overlayConfirm.appendTo('body');
        $('.gforces-assistant--overlay--confirm').fadeIn(250).delay(550).fadeOut();
        return;
    }

    for (module in modules) {
        $(modules[module].el).attr('id', 'overflow-scrollto-' + modules[module].id);
        $(modules[module].el).css('background', 'red');
        var link = $('<a class="link" data-id="' + modules[module].value + '" href="#overflow-scrollto-' + modules[module].id + '">' + modules[module].value + '</a>');
        link.appendTo(modal);
    }
    if (modules.length > 10) modal.addClass('double-width');
    modal.appendTo('body');
}

overflow.modalClose = function(modules) {
    $('.gforces-assistant--slashes .close').click(function(e) {
        e.preventDefault();
        $(this).parent().remove();

        for (module in modules) {
            modules[module].el.css('background', 'inherit');
        }
    })
}

overflow.clickAlert = function(modules) {

    $('.gforces-assistant--slashes .link').click(function() {
        var id = $(this).attr('data-id');

        $(modules[id].el).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    });
}

overflow.init = function() {

	overflow.get().then(function(elements) {
        overflow.present(elements);
        overflow.clickAlert(elements);
        overflow.modalClose(elements);
	});
}



overflow.init();