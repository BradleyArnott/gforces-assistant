const cloneButton = {

    init() {
        this.insert().then(() => {
            this.clickEvents();
        });
    },

    insert() {
        return new Promise(((resolve) => {
            const buttons = document.querySelectorAll('.module .nd-module-btns');

            buttons.forEach((button) => {
                const clone = button.querySelector('.js-module-clone');
                if (!clone) {
                    const newButton = document.createElement('a');
                    newButton.className = 'js-module-clone nd-clone nd-module-remove';
                    newButton.style.cssText = 'background: #49ddaa !important;';
                    newButton.innerHTML = '<i class="nd-icon-plus nd-icon-invert" style="background-position: -408px -96px;"></i>';
                    button.appendChild(newButton);
                }
            });
            resolve();
        }));
    },

    clickEvents() {
        const cloneButtons = document.querySelectorAll('.js-module-clone');

        cloneButtons.forEach((moduleButton) => {
            moduleButton.addEventListener('click', () => {
                const module = moduleButton.parentNode.parentNode;
                const clone = module.cloneNode(true);
                module.parentNode.insertBefore(clone, module.nextSibling);
            });
        });
    },
};

cloneButton.init();
