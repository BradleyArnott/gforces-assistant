var trailingSlashes = {},
    ModulesToIgnore = [
    'social-icons',
    'reevoo-badge',
    'google-map',
    'social-widget'
];

trailingSlashes.check = function() {
    $('.gforces-assistant--overlay--confirm').remove();

    return new Promise(function(resolve, reject) {
        var naughtyList = {},
            id = 0;

        $('a').each(function() {
            var theUrl = $(this).attr('href');
            if (!theUrl) return;
            if (theUrl === undefined) return;
            if (theUrl == 'null') return;
            if (theUrl.endsWith('/')) return;
            if (theUrl.startsWith('#')) return;
            if (theUrl.endsWith('#')) return;
            if (theUrl.startsWith('javascript:')) return;

            var parent = $(this).closest('.module');

            for (module in ModulesToIgnore) {
                if (parent.hasClass(ModulesToIgnore[module])) return;
            }

            if (naughtyList[parent[0].classList.value]) {
                naughtyList[parent[0].classList.value].count++;
                return;
            }
            naughtyList[parent[0].classList.value] = {
                id: id,
                el: parent,
                value: parent[0].classList.value,
                count: 1
            };
            id++;
        });
        resolve(naughtyList);
    })  
}

trailingSlashes.present = function(modules) {
    var modal = $('<div class="gforces-assistant--slashes"><a href="#" class="close">X</a><div class="title">Missing trailing slashes:</div></div>');

    if ($.isEmptyObject(modules)) {
        var overlayConfirm = $('<div class="gforces-assistant--overlay--confirm"><div class="box"></div></div>');
        overlayConfirm.appendTo('body');
        $('.gforces-assistant--overlay--confirm').fadeIn(250).delay(550).fadeOut();
        return;
    }

    for (module in modules) {
        modules[module].el.attr('id', 'assistant-scrollto-' + modules[module].id);
        modules[module].el.css('background', 'red');
        var link = $('<a class="link" data-id="' + modules[module].value + '" href="#assistant-scrollto-' + modules[module].id + '">' + modules[module].value + '<div class="value">' + modules[module].count + '</div></a>');
        link.appendTo(modal);
    }
    if (modules.length > 10) modal.addClass('double-width');
    modal.appendTo('body');
}

trailingSlashes.modalClose = function(modules) {
    $('.gforces-assistant--slashes .close').click(function(e) {
        e.preventDefault();
        $(this).parent().remove();

        for (module in modules) {
            modules[module].el.css('background', 'inherit');
        }
    })
}

trailingSlashes.clickAlert = function(modules) {

    $('.gforces-assistant--slashes .link').click(function() {
        var id = $(this).attr('data-id');

        $(modules[id].el).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    });
}

trailingSlashes.init = function() {

    trailingSlashes.check().then(function(modules){
        trailingSlashes.present(modules);
        trailingSlashes.clickAlert(modules);
        trailingSlashes.modalClose(modules);
    });
}

trailingSlashes.init();