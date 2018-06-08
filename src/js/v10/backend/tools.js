const editorTools = {

    init() {
        const inEditor = document.querySelector('link[href*="/templateEditor.css"]');
        if (!inEditor) return;
        V10settings.get('editorTools').then((isOn) => {
            if (!isOn) return;
            this.inject('css', 'css/v10/templateEditor.css');
            setTimeout(() => {
                inEditor.parentNode.removeChild(inEditor);
                document.body.classList.add('nd-edit-preview');
                this.inject('js', 'js/v10/backend/order.js');
                this.inject('js', 'js/v10/backend/clone.js');
                this.inject('css', 'css/v10/editor.css');
                this.addStyleToggle();
            }, 2000);
        });
    },

    addStyleToggle() {
        const menuItem = document.querySelector('.nd-btn-edit-layout') || document.querySelector('.nd-btn-edit-content');
        if (!menuItem) return;
        const liNode = document.createElement('li');
        const aNode = document.createElement('a');
        const textNode = document.createTextNode('Toggle wireframe view');
        aNode.classList.add('nd-btn-wirframe');
        aNode.appendChild(textNode);
        liNode.appendChild(aNode);
        menuItem.parentNode.appendChild(aNode);

        aNode.onclick = (e) => {
            e.preventDefault();
            const css = document.querySelector('.css');
            const media = css.getAttribute('media');
            if (!css) return;
            if (media === 'none') {
                css.setAttribute('media', 'all');
                document.body.classList.add('nd-edit-preview');
                document.body.classList.remove('nd-edit-wireframe');
            }
            if (media === 'all') {
                css.setAttribute('media', 'none');
                document.body.classList.remove('nd-edit-preview');
                document.body.classList.add('nd-edit-wireframe');
            }
        };
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
