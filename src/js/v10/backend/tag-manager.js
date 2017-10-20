const tagManager = {
    CMeditor: '',
    tags: [
        {
            id: 0,
            name: 'JS Absolute',
            ref: 'js-absolute.js',
        },
        {
            id: 1,
            name: 'JS Absolute (Advanced)',
            ref: 'js-absolute-advanced.js',
        },
        {
            id: 2,
            name: 'Judge Service',
            ref: 'judge-service-superwidget.js',
        },
        {
            id: 3,
            name: 'Miappi',
            ref: 'miappi.js',
        },
        {
            id: 4,
            name: 'HR Spacing',
            ref: 'hr-spacing.js',
        },
        {
            id: 5,
            name: 'New Car Detail (Desktop-first)',
            ref: 'new-car-detail.js',
        },
        {
            id: 6,
            name: 'New Car Detail (User-first)',
            ref: 'new-car-detail-MF.js',
        },
        {
            id: 7,
            name: 'Import Multi-scripts',
            ref: '_ND/getMultiScripts.js',
        },
        {
            id: 8,
            name: 'Current Year',
            ref: 'footer-year.js',
        },
        {
            id: 9,
            name: 'Open in new tab',
            ref: 'open-in-new-tab-button.js',
        },
        {
            id: 10,
            name: 'Scrolling footer toggle',
            ref: 'footer-toggle-scroll.js',
        },
    ],

    init() {
        document.body.addEventListener('click', (e) => {
            const el = e.target;
            if (el.id === 'add-tag' || el.classList.contains('edit-tag')) {
                console.log(true);
                tagManager.checkSnippet().then(() => {
                    tagManager.addEditor();
                    tagManager.addSearch();
                    tagManager.searchFunction();
                    tagManager.addButton();
                    tagManager.removeButton();
                });
            }
        });
    },

    populate() {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            let content = '<a href="#" class="custom-css-js--close"></a><div class="nd-widget-title"><h2>Predefined CSS Scripts</h2></div>';

            this.tags.forEach((tag) => {
                const { name, id } = tag;
                content += `<a href="#"" class="script" data-id="${id}"><div class="inner">${name}</div></a>`;
            });

            container.className = 'nd-widget-box custom-css-js--container';
            container.innerHTML = content;
            document.body.appendChild(container);
            resolve();
        });
    },

    searchFunction() {
        const input = document.querySelector('#template-search');
        const parent = document.querySelector('.table-menu');

        input.onkeyup = () => {
            const filter = input.value.toUpperCase();
            const list = parent.querySelectorAll('li');

            list.forEach((li) => {
                const label = li.querySelector('label').innerHTML.toUpperCase();
                if (label.includes(filter)) li.style.display = '';
                else li.style.display = 'none';
            });
        };
    },

    addSearch() {
        return new Promise(((resolve) => {
            const reference = document.querySelector('.nd-table-checkbox-dropdown .table-menu > div:first-child');
            const input = document.createElement('div');
            input.className = 'padding-bottom padding-left';
            input.innerHTML = '<input type="text" id="template-search" placeholder="Search for templates">';
            reference.parentNode.insertBefore(input, reference.nextSibling);
            resolve();
        }));
    },

    addButton() {
        const button = document.createElement('a');
        button.id = 'add-css-tag';
        button.className = 'btn btn-success css-assistant--button';
        button.href = '#';
        button.setAttribute('title', 'Add');
        button.innerHTML = 'Use predefined code';
        document.body.appendChild(button);

        button.addEventListener('click', (e) => {
            e.preventDefault();
            const container = document.querySelector('.custom-css-js--container');
            if (container) container.remove();
            tagManager.populate().then(() => {
                tagManager.scriptClick();
                tagManager.scriptClose();
            });
        });

        const save = document.querySelector('#save-tag');
        save.addEventListener('click', () => {
            document.querySelector('#add-css-tag').remove();
        });
    },

    removeButton() {
        const button = document.querySelector('#cancel-tag-edit');

        button.addEventListener('click', () => {
            document.querySelector('#add-css-tag').remove();
            document.querySelector('#template-search').remove();
        });
    },

    addEditor() {
        this.CMeditor = CodeMirror.fromTextArea(document.getElementById('Snippet_content'), {
            mode: 'javascript',
            lineNumbers: true,
            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
            theme: 'monokai',
            keyMap: 'sublime',
            lineWrapping: true,
            gutters: ['CodeMirror-lint-markers'],
            lint: true,
            lintOnChange: true,
        });

        const save = () => this.CMeditor.save();
        this.CMeditor.on('change', save);
        document.querySelector('.nd-form-standard > .row-fluid > .span8').classList.remove('span8');
    },

    scriptClick() {
        const scripts = document.querySelectorAll('.custom-css-js--container .script');

        scripts.forEach((script) => {
            script.addEventListener('click', (e) => {
                e.preventDefault();
                const { id } = script.dataset;
                tagManager.get(id);
                script.parentNode.remove();
            });
        });
    },

    scriptClose() {
        const close = document.querySelector('.custom-css-js--close');
        close.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.custom-css-js--container').remove();
        });
    },

    checkSnippet() {
        return new Promise((resolve) => {
            const checkTextArea = setInterval(() => {
                const textArea = document.querySelector('#Snippet_content');

                if (textArea) {
                    clearInterval(checkTextArea);
                    resolve();
                }
            }, 100);
        });
    },

    get(ID) {
        const request = new XMLHttpRequest();
        const { ref, name } = this.tags[ID];
        const editor = document.getElementById('Snippet_content');
        const codeMirror = document.querySelector('.CodeMirror');

        request.open('GET', `https://gforcesdevtest.slsapp.com/source/netdirector-auto-resources/trunk/00.%20Misc/js/${ref}`, true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                document.getElementById('Snippet_title').value = `CSS - ${name}`;
                editor.value = request.response;

                if (codeMirror) this.CMeditor.setValue(editor.value);
            }
        };
        request.send();
    },
};

tagManager.init();
