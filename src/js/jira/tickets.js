const tickets = {
    date: moment().format('MM DD YYYY'),
    username: document.querySelector('#header-details-user-fullname').dataset.username,
    tToday: 0,
    hToday: 0,
    tNext: 0,
    hNext: 0,
    nextWord: '',
    nextDate: '',
    colours: {
        good: '#cfe9b6',
        late: '#e9b6b6',
        modified: '#f0b664',
        mine: '#b6e9db',
    },
    champions: [
        {
            name: 'matt.mumford',
            type: 'Mazda',
            table: '#gadget-71902-renderbox',
        },
        {
            name: 'beau.august',
            type: 'Vauxhall',
            table: '#gadget-72006-renderbox',
        },
        {
            name: 'chris.kent',
            type: 'IM Group',
            table: '#gadget-71901-renderbox',
        },
        {
            name: 'nuno.barros',
            type: 'GMME',
            table: '#gadget-72007-renderbox',
        },
    ],
    OEM: [
        {
            label: 'css-im-group',
            refs: [
                'IMGROUP', // Master
                'SMLA', // Subaru Master
            ],
        },
        {
            label: 'css-vauxhall',
            refs: [
                'VVB', // Master
                'BEVB', // Bellingers
                'BVB', // Beadles
                'GVB', // Go Vauxhall
                'BURNHAM', // Advance Vauxhall
                'THURLOW', // Thurlow Nunn
                'VAUXUFM', // Vauxhall Migrations
            ],
        },
        {
            label: 'css-mazda',
            refs: [
                'MAZDAB', // Master
                'MUVLB', // UVL
            ],
        },
        {
            label: 'css-gmme',
            refs: [
                'GMME', // Master
                'GCREB', // Chevrolet
                'GCNCC', // Cadillac
                'UB-', // UMA
            ],
        },
    ],

    init() {
        V10settings.get('checkTickets').then((checkTickets) => {
            if (!checkTickets) return;
            setTimeout(() => {
                this.loopTables();
                this.championTickets();
                this.approval();
                this.myIssues();
                this.checkWorkQueue();
                this.checkQuoteQueue();
            }, 1500);
        });
    },

    loopTables() {
        this.checkNext();
        this.loopTickets();
        this.showData();
    },

    loopTickets() {
        let rows = document.querySelectorAll('#gadget-11706-renderbox .issuerow');
        if (!rows.length) rows = document.querySelectorAll('#gadget-69203-renderbox .issuerow');
        const ticketsObj = {};

        rows.forEach((row) => {
            const due = row.querySelector('.customfield_11004 time').getAttribute('datetime');
            const updated = row.querySelector('.updated time').getAttribute('datetime');
            const timeData = {
                timeUnix: moment().unix(),
                date: moment(due).format('MM DD YYYY'),
                dateUnix: moment(due).unix(),
                updatedDate: moment(updated).format('MM DD YYYY'),
                updatedTime: moment(updated).format('HH:mm'),
            };

            this.group(timeData, row, ticketsObj);
            this.good(timeData, row);
            this.late(timeData, row);
            this.modified(timeData, row);
            this.tToday += this.today(timeData, row);
            this.tNext += this.next(timeData, row);
        });
        this.colorGroups(ticketsObj);
    },

    checkNext() {
        const nextDay = moment().add(1, 'days').weekday();
        let numDays = 1;
        if (nextDay === 6) numDays += 2;
        if (nextDay === 0) numDays += 1;
        this.nextDate = moment().add(numDays, 'days').format('MM DD YYYY');
        this.nextWord = numDays === 1 ? 'Tomorrow' : moment(this.nextDate).format('dddd');
    },

    group(timeData, el, obj) {
        if (this.date !== timeData.date) return;
        const issueKey = el.dataset.issuekey;
        const keyString = issueKey.split('-')[0];
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        if (obj[keyString]) obj[keyString].items.push(el);
        else obj[keyString] = { color, items: [el] };
    },

    colorGroups(obj) {
        Object.keys(obj).forEach((key) => {
            const { items, color } = obj[key];

            if (items.length <= 1) return;

            items.forEach((el) => {
                el.querySelector('.issuetype').style.backgroundColor = color;
            });
        });
    },

    good(timeData, el) {
        if (timeData.dateUnix < timeData.timeUnix) return;
        if (this.date !== timeData.date) return;
        el.style.backgroundColor = this.colours.good;
    },

    late(timeData, el) {
        if (timeData.dateUnix > timeData.timeUnix) return;
        el.style.backgroundColor = this.colours.late;
    },

    modified(timeData, el) {
        if (this.date !== timeData.date) return;
        if (timeData.updatedDate !== this.date) return;
        if (timeData.updatedTime < '09:30') return;
        el.style.backgroundColor = this.colours.modified;
    },

    today(timeData, el) {
        if (this.date !== timeData.date) return 0;
        const status = el.querySelector('.status span').innerHTML;
        if (status === 'In Progress') return 0;
        const estimate = this.timeSpent(el.querySelector('.timeoriginalestimate').innerHTML);
        if (Number.isNaN(estimate)) return 0;
        const worked = this.timeSpent(el.querySelector('.timespent').innerHTML);
        const hours = estimate - worked;
        if (hours < 0) return 1;
        this.hToday += hours;
        return 1;
    },

    next(timeData, el) {
        if (this.nextDate !== timeData.date) return 0;
        const status = el.querySelector('.status span').innerHTML;
        if (status === 'In Progress') return 0;
        const estimate = this.timeSpent(el.querySelector('.timeoriginalestimate').innerHTML);
        el.style.backgroundColor = '#e5e5e5';
        if (Number.isNaN(estimate)) return 0;
        const worked = this.timeSpent(el.querySelector('.timespent').innerHTML);
        const hours = estimate - worked;
        if (hours < 0) return 1;
        this.hNext += hours;
        return 1;
    },

    timeSpent(time) {
        const timeSpentArr = time.split(' ');
        let newTimeSpent = 0;

        timeSpentArr.forEach((unit) => {
            if (unit) {
                let newTime = unit;
                if (unit.indexOf('m') >= 0) newTime = parseFloat(newTime) / 60;
                newTimeSpent = parseFloat(newTime) + parseFloat(newTimeSpent);
            }
        });
        if (newTimeSpent < 0) newTimeSpent = 0;
        return newTimeSpent;
    },

    championTickets() {
        this.champions.forEach((champion, index) => {
            const user = this.champions[index];
            if (user.name !== this.username) return;
            const table = document.querySelector(user.table);
            if (!table) return;
            const issues = table.querySelectorAll('.issuerow').length;
            const plural = issues === 1 ? 'is' : 'are';
            const pluralTickets = issues === 1 ? 'ticket' : 'tickets';
            const text = `There ${plural} <strong>${issues}</strong> ${user.type}-related ${pluralTickets}`;
            const el = document.createElement('div');
            el.className = 'ticket-count champion';
            el.innerHTML = `<div class="inner">${text}</div>`;
            document.querySelector('.ticket-count-container').appendChild(el);
        });
    },

    approval() {
        let table = document.querySelector('#gadget-79400-renderbox');
        if (!table) table = document.querySelector('#gadget-73000-renderbox');
        const approvals = table.querySelectorAll('.issuerow').length;
        const plural = approvals === 1 ? 'is' : 'are';
        const pluralTickets = approvals === 1 ? 'ticket' : 'tickets';
        const text = `There ${plural} <strong>${approvals}</strong> third-party approval ${pluralTickets}`;
        const el = document.createElement('div');
        el.className = 'ticket-count approval';
        el.innerHTML = `<div class="inner">${text}</div>`;
        document.querySelector('.ticket-count-container').appendChild(el);
    },

    showData() {
        const dashboard = document.querySelector('.page-type-dashboard #content');
        const container = document.createElement('div');
        container.className = 'ticket-count-container';
        const today = (this.tToday === 0) ? '<div class="ticket-count today completed"><div class="inner">All tickets done for today</div></div>' : `<div class="ticket-count today"><div class="inner">Total Hours Today <strong>${this.hToday.toFixed(1)}</strong> Total Tickets Today <strong>${this.tToday}</strong></div></div>`;
        const next = `<div class="ticket-count tomorrow"><div class="inner">Total hours ${this.nextWord} <strong>${this.hNext.toFixed(1)}</strong> Total tickets ${this.nextWord} <strong>${this.tNext}</strong></div></div>`;

        container.innerHTML = today + next;
        dashboard.insertBefore(container, dashboard.firstChild);
    },

    myIssues() {
        const rows = document.querySelectorAll('#gadget-54826-chrome .issuerow');
        rows.forEach((row) => {
            const reporter = row.querySelector('.reporter a').getAttribute('rel');
            if (reporter !== this.username) return;
            row.style.backgroundColor = this.colours.mine;
        });
    },

    checkWorkQueue() {
        const request = new XMLHttpRequest();
        request.open('GET', 'https://jira.netdirector.co.uk/rest/api/2/search?jql=status+in+(%22In+Progress%22,+Reopened,+Error,+Reported,+%22To+Do%22,+%22More+Information%22,+Queued)+AND+(labels+not+in+(CSSQueue,+ProjectCSS,+MobileFirstMigration,+css-core,+css-site-review,+css-code-review)+OR+labels+is+EMPTY)+AND+type+!%3D+%22Project+-+Design%22+AND+assignee+in+(EMPTY)+AND+NOT+reporter+in+(api.user)+AND+Department+%3D+CSS+AND+NOT+project+%3D+11300+AND+NOT+project+%3D+%22Third+Party+Code+Approval%22+AND+issuetype+!%3D+%22QA+Sub-Task%22+ORDER+BY+updated+DESC', true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                const data = JSON.parse(request.response);
                const { issues } = data;

                issues.forEach((issue) => {
                    this.checkQuote(issue);
                    this.checkDue(issue);
                    this.labelOEM(issue);
                });
            }
        };
        request.send();
    },

    checkQuoteQueue() {
        const time = moment().unix();
        let rows = document.querySelectorAll('#gadget-11703-chrome .issuerow');
        if (!rows.length) rows = document.querySelectorAll('#gadget-69210-chrome .issuerow');

        rows.forEach((row) => {
            const updated = row.querySelector('.updated time').getAttribute('datetime');
            const unix = moment(updated).unix();
            if ((unix + 3600) < time) row.style.backgroundColor = this.colours.late;
        });
    },

    clearNotDue(issue) {
        this.getTransitions(issue.key).then((data) => {
            const message = `*Automated message:* This ticket has been set to 'More Info', because it is in the CSS MS ticket queue without a due date & time. 
                            If the time is now after 09:30 AM, please set the due date to no earlier than the next working day. 
                            If this ticket is yet to be quoted on, please move it to the quote queue.
                            If this is QA, it may have accidentally been set to the Type 'Sub-task' instead of 'QA Sub-task.'`;
            this.addLabel(issue.key, 'css-automated-nodue');
            this.moreInfo(issue.key, message, data);
        });
    },

    checkQuote(issue) {
        const quote = issue.fields.timeoriginalestimate;
        const message = `*Automated message:* This ticket has been set to 'More Info', because it is in the CSS MS ticket queue without a quote.
                        If this is an MS ticket, please move it to the quote queue.
                        If this is QA, it may have accidentally been set to the Type 'Sub-task' instead of 'QA Sub-task.'`;
        if (quote !== null) return;
        this.getTransitions(issue.key).then((data) => {
            this.addLabel(issue.key, 'css-automated-noquote');
            this.moreInfo(issue.key, message, data);
        });
    },

    checkDue(issue) {
        if (issue.fields.customfield_11004 === null) this.clearNotDue(issue);
    },

    getTransitions(key) {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            request.open('GET', `https://jira.netdirector.co.uk/rest/api/2/issue/${key}/transitions?expand=transitions.fields`, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    const data = JSON.parse(request.response);
                    const { transitions } = data;

                    transitions.forEach((transition) => {
                        const { name, id } = transition;
                        if ('More Info'.indexOf(name) === -1) return;
                        resolve(id);
                    });
                }
            };
            request.send();
        });
    },

    moreInfo(key, message, transitionID) {
        const request = new XMLHttpRequest();
        let data = {
            update: {
                comment: [
                    {
                        add: {
                            body: message,
                        },
                    },
                ],
            },
            transition: {
                id: transitionID,
            },
        };

        request.open('POST', `https://jira.netdirector.co.uk/rest/api/2/issue/${key}/transitions?expand=transitions.fields`, true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                console.log(`${key} set to "More Info"`);
            }
        };
        data = JSON.stringify(data);
        request.send(data);
    },

    addLabel(key, label) {
        const request = new XMLHttpRequest();
        let data = {
            update: {
                labels: [
                    {
                        add: label,
                    },
                ],
            },
        };

        request.open('PUT', `https://jira.netdirector.co.uk/rest/api/2/issue/${key}`, true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                console.log(`label "${label}" added to ${key}`);
            }
        };

        data = JSON.stringify(data);
        request.send(data);
    },

    labelOEM(issue) {
        const { key } = issue;
        const { labels } = issue.fields;
        const keyRef = key.split('-')[0];

        const isOEM = this.OEM
            .filter(group => group.refs.includes(keyRef))
            .filter(group => !labels.includes(group.label));

        if (isOEM.length) this.addLabel(key, isOEM[0].label);
    },
};

tickets.init();
