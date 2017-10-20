const trailingSlashes = {
    naughtyList: {},
    ignore: [
        'social-icons',
        'reevoo-badge',
        'google-map',
        'social-widget',
    ],

    async init() {
        await trailingSlashes.check();
        trailingSlashes.present();
        trailingSlashes.modalClose();
    },

    check() {
        return new Promise(((resolve) => {
            const links = document.querySelectorAll('a');
            let id = 0;

            links.forEach((link) => {
                const theUrl = link.getAttribute('href');
                if (!theUrl) return;
                if (theUrl === undefined) return;
                if (theUrl === 'null') return;
                if (theUrl.endsWith('/')) return;
                if (theUrl.startsWith('tel:')) return;
                if (theUrl.startsWith('#')) return;
                if (theUrl.endsWith('#')) return;
                if (theUrl.startsWith('javascript:')) return;


                const parent = this.findAncestor(link, 'module');
                if (!parent) return;

                const shouldIgnore = this.ignoreModules(parent);
                if (shouldIgnore) return;

                if (this.naughtyList[parent.className]) return;

                this.naughtyList[parent.className] = {
                    id,
                    el: parent,
                    value: parent.className,
                };
                id += 1;
            });

            resolve();
        }));
    },

    findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    },

    ignoreModules(el) {
        const hasClass = this.ignore.filter(module => el.className.includes(module));
        if (hasClass.length) return true;
        return false;
    },

    loopModules() {
        let modal = '<div class="gforces-assistant--slashes"><a href="#" class="close">X</a><div class="title">Missing trailing slashes:</div>';

        Object.keys(this.naughtyList).forEach((module) => {
            console.log(this.naughtyList[module].el);
            this.naughtyList[module].el.setAttribute('id', `slashes-scrollto-${this.naughtyList[module].id}`);
            this.naughtyList[module].el.style.backgroundColor = 'red';
            const link = `<a class="link" data-id="${this.naughtyList[module].value}" href="#slashes-scrollto-${this.naughtyList[module].id}">${this.naughtyList[module].value}</a>`;
            modal += link;
        });
        return modal;
    },

    present() {
        if (Object.keys(this.naughtyList).length === 0) return this.perfect();

        let data = this.loopModules(this.naughtyList);
        data += '</div>';
        const modal = document.createElement('div');
        modal.innerHTML = data;
        if (this.naughtyList.length > 10) modal.classList.add('double-width');
        return document.body.appendChild(modal);
    },

    perfect() {
        const confirm = document.createElement('div');
        confirm.className = 'gforces-assistant--overlay--confirm';
        confirm.innerHTML = '<div class="box"></div>';
        document.body.appendChild(confirm);
        confirm.style.display = 'block';

        setTimeout(() => {
            confirm.style.display = 'none';
        }, 800);
    },

    modalClose() {
        const close = document.querySelector('.gforces-assistant--slashes .close');
        close.addEventListener('click', (e) => {
            e.preventDefault();
            close.parentNode.remove();
            Object.keys(this.naughtyList).forEach((module) => {
                this.naughtyList[module].el.style = '';
            });
        });
    },
};

trailingSlashes.init();
