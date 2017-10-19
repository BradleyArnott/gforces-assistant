const editorTools = {

    init() {
        const inEditor = document.querySelector('link[href*="/templateEditor.css"]');
        if (!inEditor) return;
        V10settings.get('editorTools').then((isOn) => {
            if (!isOn) return;
            setTimeout(() => {
                this.inject('js', 'js/v10/backend/order.js');
                this.inject('js', 'js/v10/backend/clone.js');
                this.inject('css', 'css/v10/editor.css');
            }, 2000);
        });
    },

    createCSS(path) {
        const el = document.createElement('link');
        el.href = path;
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('type', 'text/css');
        return el;
    },

    createScript(path) {
        const el = document.createElement('script');
        el.setAttribute('src', path);
        return el;
    },

    inject(type, file) {
        const path = chrome.extension.getURL(file);
        const code = type === 'css' ? this.createCSS(path) : this.createScript(path);

        document.head.appendChild(code);
    },
};

editorTools.init();
