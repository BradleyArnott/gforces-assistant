const editorTools = {

    init() {
        const isInEditor = $('[href*="/templateEditor.css"]');
        if (!isInEditor.length) return;
        settings.get('editorTools').then((isOn) => {
            if (!isOn) return;
            setTimeout(() => {
                this.injectContent('js', 'js/v10/backend/order.js');
                this.injectContent('js', 'js/v10/backend/clone.js');
                this.injectContent('js', 'js/v10/backend/templates.js');
                this.injectContent('css', 'css/v10/editor.css');
            }, 2000);
        });
    },

    injectContent(type, filePath) {
        const codePath = chrome.extension.getURL(filePath);
        const codeLink = type === 'css' ? $('<link>').attr('href', codePath).attr('rel', 'stylesheet').attr('type', 'text/css') : $('<script>').attr('src', codePath);

        $('head').append(codeLink);
    },
};

editorTools.init();
