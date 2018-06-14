
const cheatSheetMarkup = '<div data-toggle="collapse" data-target="#nd-accordion-box" class="nd-widget-title nd-widget-title-accordion collapsed"><span class="icon nd-icon-right"> <a href="#nd-accordion-box" data-toggle="collapse" class="accordion-toggle icon-down collapsed"></a></span><h2> <i class="icon-info-sign icon-green "></i>Tag Managment Cheatsheet</h2></div><div data-toggle="collapse" class="nd-widget-accordion collapse" id="nd-accordion-box" style="height: 0px;"><div class="nd-widget-content"> <div class="row-fluid"> <div class="span12"> <div class="alert alert-info">The below examples are to help with adding scripts into tag management</div></div></div><div class="row-fluid"> <div class="span12"> <div id="grid" class="grid"> </div></div></div></div></div><style>.grid{column-count: 4; background: #333; color: #fff; height: 100%; padding: 20px; overflow: auto; font-size: 14px;}.grid-item{break-inside: avoid; page-break-inside: avoid; padding: 10px;}.heading{color: #d7ba7d;}.description{color: #888;}</style>';

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
                this.checkSnippet()
                    .then(() => {
                        this.addEditor();
                        this.addSearch();
                        this.searchFunction();
                        this.addButton();
                        this.removeButton();
                        this.addCheatSheet();
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
        document.getElementById('tag-form').querySelector('.control-group').appendChild(button);

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
        const editor = document.getElementById('Snippet_content');
        this.CMeditor = CodeMirror.fromTextArea(editor, {
            mode: 'javascript',
            lineNumbers: true,
            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
            theme: 'one-dark',
            keyMap: 'sublime',
            gutters: ['CodeMirror-lint-markers'],
            lint: true,
            lintOnChange: true,
        });

        const save = () => this.CMeditor.save();
        if (!editor.value.trim()) this.loadDefaultScript();
        this.CMeditor.on('change', save);
        document.querySelector('.nd-form-standard > .row-fluid > .span8').classList.remove('span8');
    },

    loadDefaultScript() {
        const request = new XMLHttpRequest();
        const editor = document.getElementById('Snippet_content');
        const codeMirror = document.querySelector('.CodeMirror');
        request.open('GET', chrome.extension.getURL('js/v10/backend/default-script.js'), true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                editor.value = request.response;
                if (codeMirror) this.CMeditor.setValue(editor.value);
            }
        };
        request.send();
    },

    addCheatSheet() {
        const tagForm = document.getElementById('tag-form');
        const content = cheatSheetMarkup;
        const widget = document.createElement('div');
        widget.classList.add('nd-widget-box');
        widget.innerHTML = content;
        tagForm.appendChild(widget);

        const request = new XMLHttpRequest();
        request.open('GET', chrome.extension.getURL('js/v10/backend/cheatsheet.json'), true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                const grid = document.getElementById('grid');
                const html = JSON.parse(request.response).map(v => `<div class="grid-item">
                    <div class="heading">${v.heading}</div>
                    <div class="description">${v.description}</div>
                    <pre class="language-javascript"><code class="language-javascript">${v.code}</code></pre>
                </div>`);
                grid.innerHTML = html.join('');
                Prism.highlightAll();
            }
        };
        request.send();
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
