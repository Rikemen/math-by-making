(() => {
    const tabs = [...document.querySelectorAll('[role="tab"]')];

    const selectTab = (nextTab, shouldFocus = false) => {
        tabs.forEach((tab) => {
            const isSelected = tab === nextTab;
            const panelId = tab.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : null;

            tab.setAttribute('aria-selected', String(isSelected));
            tab.tabIndex = isSelected ? 0 : -1;
            tab.classList.toggle('active', isSelected);

            if (panel) {
                panel.hidden = !isSelected;
                panel.classList.toggle('active', isSelected);
            }
        });

        if (shouldFocus) nextTab.focus();
    };

    const selectRelativeTab = (currentIndex, offset) => {
        const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
        selectTab(tabs[nextIndex], true);
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectTab(tab));
        tab.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                selectRelativeTab(index, -1);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                selectRelativeTab(index, 1);
            }
        });
    });

    const selectedTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
    if (selectedTab) selectTab(selectedTab);
})();
