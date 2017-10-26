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
    labels: [
        'repeatissue',
        'css-qa-config',
        'css-qa-content',
        'css-qa-setup',
        'css-qa-dev',
        'css-core',
        'css-scope-change',
    ],

    init() {
        V10settings.get('checkSubTasks').then((checkSubTasks) => {
            if (!checkSubTasks) return;
            this.loopList();
            this.addButton();
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
        const labels = Array.from(labelEl.querySelectorAll('a'));
        const labelString = labels.reduce((string, label) => `${string} ${label.getAttribute('title')}`, '');
        el.classList.add('has-label');
        el.setAttribute('title', labelString);
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
                const rows = this.table.querySelectorAll('.issuerow');
                rows.forEach((row) => {
                    row.style.display = 'table-row';
                });
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
};

subtasks.init();
