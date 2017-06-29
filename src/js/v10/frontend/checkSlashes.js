var trailingSlashes = {},
    ModulesToIgnore = [
    'social-icons',
    'reevoo-badge',
    'google-map',
    'social-widget'
];

trailingSlashes.check = function() {

    return new Promise(function(resolve, reject) {
        var naughtyList = [];

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
            naughtyList.push(parent);
        });
        resolve(naughtyList);
    })  
}

trailingSlashes.present = function(modules) {
    var modal = $('<div class="gforces-assistant--slashes"><div class="title">Missing trailing slashes:</div></div>');

    for (module in modules) {
        var classList = modules[module][0].classList.value;
        modules[module].attr('id', 'assistant-scrollto-' + module);
        modules[module].css('background', 'red');
        var link = $('<a data-id="' + module + '" href="#assistant-scrollto-' + module + '">' + classList + '</a>');
        link.appendTo(modal);
    }
    modal.appendTo('body');
}

trailingSlashes.clickAlert = function(modules) {

    $('.gforces-assistant--slashes a').click(function() {
        var id = $(this).attr('data-id');
        $(modules[id]).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    });
}

trailingSlashes.init = function() {

    trailingSlashes.check().then(function(modules){
        trailingSlashes.present(modules);
        trailingSlashes.clickAlert(modules);
    });
}

trailingSlashes.init();