const overflow = {

    init() {
        this.get()
            .then((elements) => {
                this.present(elements);
                this.clickAlert(elements);
                this.modalClose(elements);
            });
    },

    get() {
        const overlay = document.querySelector('.gforces-assistant--overlay--confirm');

        if (overlay) overlay.remove();

        return new Promise(((resolve) => {
            const docWidth = document.documentElement.offsetWidth;
            const naughtyList = {};
            const els = document.querySelectorAll('*');
            let id = 0;

            els.forEach((el) => {
                if (el.offsetWidth > docWidth) {
                    naughtyList[el.classList.value] = {
                        id,
                        el,
                        value: el.classList.value,
                    };
                    id += 1;
                }
            });
            resolve(naughtyList);
        }));
    },

    loopModules(modules) {
        let modal = '<div class="gforces-assistant--slashes"><a href="#" class="close">X</a><div class="title">Overflowing Content:</div></div>';

        Object.keys(modules).forEach((module) => {
            console.log(modules[module].el);
            modules[module].el.setAttribute('id', `overflow-scrollto-${modules[module].id}`);
            modules[module].el.style.backgroundColor = 'red';
            const link = `<a class="link" data-id="${modules[module].value}" href="#overflow-scrollto-${modules[module].id}">${modules[module].value}</a>`;
            modal += link;
        });
        return modal;
    },

    present(modules) {
        if (Object.keys(modules).length === 0) {
            const overlayConfirm = '<div class="gforces-assistant--overlay--confirm"><div class="box"></div></div>';
            document.body.appendChild(overlayConfirm);
            document.querySelector('.gforces-assistant--overlay--confirm').fadeIn(250).delay(550).fadeOut();
            return;
        }

        let data = this.loopModules(modules);
        data += '</div>';
        const modal = document.createElement('div');
        modal.innerHTML = data;
        if (modules.length > 10) modal.classList.add('double-width');
        document.body.appendChild(modal);
    },

    modalClose(modules) {
        const parent = document.querySelector('.gforces-assistant--slashes');
        const close = document.querySelector('.gforces-assistant--slashes .close');
        close.addEventListener('click', (e) => {
            e.preventDefault();
            parent.remove();
            Object.keys(modules).forEach((module) => {
                modules[module].el.style = '';
            });
        });
    },

    clickAlert(modules) {
        const links = document.querySelectorAll('.gforces-assistant--slashes .link');

        for (const link in links) {
            link.addEventListener('click', () => {
                const { id } = link.dataset;

                $(modules[id].el)
                    .fadeIn(100)
                    .fadeOut(100)
                    .fadeIn(100)
                    .fadeOut(100)
                    .fadeIn(100);
            });
        }
    },
};

overflow.init();
