const subtasks = {
    table: document.querySelector('#issuetable'),
    toDo: {
        Queued: '#C8E1FB',
        'Not Started': '#C8E1FB',
        'Quote requested': '#C8E1FB',
        Quoted: '#C8E1FB',
        'In Progress': '#BAF3C3',
        'More information': '#FFFFD5',
    },
    done: '#b2d8b9',
    doneLabels: [
        'Closed',
        'Resolved',
        'Rejected',
    ],
    labels: {
        repeatissue: '#ffb355',
        'css-qa-config': '#7e82ff',
        'css-qa-content': '#7e82ff',
        'css-qa-setup': '#7e82ff',
        'css-qa-dev': '#ffa4a4',
        'css-core': '#d5d832',
        'css-scope-change': '#ff6c6c',
    },

    init() {
        settings.get('checkSubTasks').then((checkSubTasks) => {
            if (!checkSubTasks) return;
            this.loopList();
            this.addButton();
            this.createKey();
        });
    },

    loopList() {
        const rows = this.table.querySelectorAll('.issuerow');

        rows.forEach((row) => {
            const status = row.querySelector('.status span').innerHTML;

            this.identifyCSS(row, status);
            this.hideTeam(row, 'PM');
            this.checkComplete(row, status);
            this.checkLabels(row);
        });
    },

    checkLabels(el) {
        const labelEl = el.querySelector('.labels-wrap > .labels');
        if (labelEl.nodeName === 'SPAN') return;
        const links = labelEl.querySelectorAll('a');

        links.forEach((link) => {
            const label = link.getAttribute('title');
            Object.keys(this.labels).forEach((value) => {
                if (label.indexOf(value) !== -1) el.style.backgroundColor = this.labels[value];
            });
        });
    },

    checkComplete(el, value) {
        const arrayPos = this.doneLabels.indexOf(value);
        if (arrayPos === -1) return;
        el.style.display = 'none';
        el.style.backgroundColor = this.done;
    },


    hideTeam(el, team) {
        const summary = el.querySelector('.stsummary a');
        const shouldHide = summary.innerHTML.includes(team);
        if (!shouldHide) return;
        el.style.display = 'none';
    },

    identifyCSS(el, value) {
        const summary = el.querySelector('.stsummary a');
        const isCSS = summary.innerHTML.includes('CSS');
        if (!isCSS) return;
        if (!this.toDo[value]) return;
        if (value === 'More information') this.table.appendChild(el);
        el.style.backgroundColor = this.toDo[value];
    },

    addButton() {
        const button = document.createElement('li');
        button.className = 'toolbar-item';
        button.innerHTML = '<a enabled="true" class="toolbar-trigger show-all-tasks"><span class="trigger-label">Show all Sub-Tasks</span></a>';
        document.querySelector('.page-type-navigator #opsbar-opsbar-transitions').appendChild(button);
        const btn = button.querySelector('a');

        btn.addEventListener('click', () => {
            const isEnabled = btn.getAttribute('enabled');
            if (isEnabled === 'true') {
                btn.setAttribute('enabled', 'false');
                btn.querySelector('span').innerHTML = 'Hide irrelevant sub-tasks';
                $('#issuetable .issuerow').css('display', 'table-row');
                return;
            }
            const rows = this.table.querySelectorAll('.issuerow');

            rows.forEach((row) => {
                row.removeAttribute('style');
            });

            this.loopList();

            btn.setAttribute('enabled', 'true');
            btn.querySelector('span').innerHTML = 'Show all sub-tasks';
        });
    },

    createKey() {
        let list = '<div class="key-title"> Label colour key:</div><ul>';

        Object.entries(this.labels).forEach((label) => {
            list += `<li><div style="background:${label[1]};"></div><span>${label[0]}</span></li>`;
        });
        list += '</ul>';

        const el = document.createElement('div');
        el.className = 'custom-css-key';
        el.innerHTML = list;
        document.querySelector('.issue-main-column #details-module_heading').appendChild(el);
    },
};

subtasks.init();
