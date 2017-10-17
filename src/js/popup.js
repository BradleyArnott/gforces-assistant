const popup = {
    devMode: false,

    async init() {
        this.modal();
        this.getToggles();

        const data = await this.checkPage();
        const loginData = await this.checkLogIn(data.url);
        if (loginData) {
            this.checkSplit(data);
            this.getDeploy(data.url);
            this.setDevMode(data.url);
            this.checkDevMode(data);
            this.buttons(data.url);
            this.dropdownButton();
            this.trailingSlashes();
            this.checkOverflow();
            this.speedTest(data.url);
        }
    },

    parseHTML(str) {
        const tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = str;
        return tmp.body;
    },

    checkPage() {
        const isOnND = '<link href="https://images.netdirector.co.uk" rel="preconnect">';
        return new Promise(((resolve) => {
            chrome.runtime.sendMessage({ action: 'getPageData' }, (data) => {
                const DOMHead = data[0].head;
                if (DOMHead.indexOf(isOnND) === -1) return;
                resolve(data[0]);
            });
        }));
    },

    checkLogIn(hostname) {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            request.open('GET', `http://${hostname}/backend/`, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    const html = this.parseHTML(request.responseText);
                    const error = html.querySelector('#login-form');
                    if (error) return;
                    document.querySelector('.backend').style.display = 'block';
                    document.querySelector('.backendTitle').innerHTML = hostname;
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            request.send();
        });
    },

    getToggles() {
        const toggles = document.querySelectorAll('.switch');

        toggles.forEach((toggle) => {
            const { option } = toggle.dataset;
            if (!option) return;
            this.setToggle(toggle);
            this.clickToggle(toggle);
        });
    },

    setToggle(el) {
        const setting = el.dataset.option;
        settings.get(setting).then((result) => {
            if (!result) return;
            el.setAttribute('enabled', result);
            el.classList.add('checked');
        });
    },

    clickToggle(el) {
        el.addEventListener('click', () => {
            el.classList.toggle('checked');
            const isActive = el.classList.contains('checked');
            const { option } = el.dataset;
            if (!option) return;

            el.setAttribute('enabled', isActive);

            chrome.runtime.sendMessage({
                action: 'saveSetting',
                label: option,
                value: isActive,
            });
        });
    },

    checkSplit(data) {
        if (!data.body.includes('vwo_loaded')) return;
        const splitAlert = document.querySelector('.backend .splitTests');
        splitAlert.classList.add('active');
    },

    trailingSlashes() {
        const button = document.querySelector('.trailing-slashes .btn');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.runtime.sendMessage({
                action: 'checkSlashes',
            });
        });
    },

    checkOverflow() {
        const button = document.querySelector('.overflow-elements .btn');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.runtime.sendMessage({
                action: 'checkOverflow',
            });
        });
    },

    getDeploy(hostname) {
        const request = new XMLHttpRequest();
        request.open('GET', `http://${hostname}/backend/assets/`, true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                const response = request.responseText;
                const html = this.parseHTML(response);
                const date = html.querySelector('#Site_assets_path option[selected=selected]').innerHTML;
                const hash = html.querySelector('.nd-widget-box .alert-info').innerHTML.split('/').slice(-1)[0];

                document.querySelector('.backendHash').innerHTML = hash;
                document.querySelector('.timestamp').innerHTML = date;
            }
        };

        request.send();
    },

    modal() {
        const options = document.querySelector('.options');
        const modal = document.querySelector('.modal');
        const confirm = document.querySelector('.modal .btn.confirm');
        const cancel = document.querySelector('.modal .btn.cancel');
        const input = document.querySelector('.modal input.password');

        options.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });

        input.addEventListener('keypress', (event) => {
            const keypress = event.keyCode || event.which;
            if (keypress !== 13) return;
            modal.style.display = '';
            this.sendAuth();
        });

        confirm.addEventListener('click', (e) => {
            e.preventDefault();

            modal.style.display = '';
            this.sendAuth();
        });

        cancel.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = '';
            input.value = '';
        });
    },

    sendAuth() {
        const username = document.querySelector('.modal input.username').value;
        const password = document.querySelector('.modal input.password').value;

        chrome.runtime.sendMessage({
            action: 'sendAuthData',
            username,
            password,
        });
    },

    buttons(hostname) {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach((button) => {
            const dataPath = button.dataset.path;
            if (!dataPath) return;
            button.href = `http://${hostname}${dataPath}`;
        });
    },

    dropdownButton() {
        const button = document.querySelector('.sprite .btn');

        button.addEventListener('click', () => {
            chrome.runtime.sendMessage({
                action: 'generateDropdown',
            });
        });
    },

    checkDevMode(data) {
        const tempBucket = data.head.match(/<link.+temp-[^"]+/g);
        if (!tempBucket) return;
        const toggle = document.querySelector('.devmode.switch');

        toggle.classList.add('checked');
        toggle.setAttribute('enabled', true);
        this.devMode = true;
    },

    setDevMode(hostname) {
        const toggle = document.querySelector('.devmode.switch');

        toggle.addEventListener('click', () => {
            this.devMode = toggle.getAttribute('enabled') === 'true'; // Convert string to boolean
            const request = new XMLHttpRequest();
            request.open('GET', `http://${hostname}/backend/assets/set-development-mode?mode=${!this.devMode}`, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    toggle.setAttribute('enabled', !this.devMode);
                    toggle.classList.toggle('checked');
                    chrome.runtime.sendMessage({
                        action: 'reloadPage',
                    });
                }
            };
            request.send();
        });
    },

    speedTest(hostname) {
        const button = document.querySelector('.speed-test');

        return new Promise((resolve) => {
            button.addEventListener('click', () => {
                const request = new XMLHttpRequest();
                const params = {
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: hostname,
                    k: 'A.f860abf3c5a1c9c511a1e0b39f7302b5',
                    f: 'json',
                    location: 'London_EC2:Chrome',
                };
                request.open('POST', 'http://www.webpagetest.org/runtest.php', true);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                request.send(params);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 400) {
                        resolve();
                    }
                };
            });
        });
    },
};

popup.init();
