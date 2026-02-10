export const initCasesToggle = () => {
    const button = document.querySelector('[data-cases-button]');
    const rows = document.querySelectorAll('.cases__row');

    if (!button || !rows.length) {
        return;
    }

    const getVisibleCount = () => {
        const width = window.innerWidth;
        if (width <= 590) return 1;
        if (width <= 990) return 2;
        return 3;
    };

    const hide = () => {
        const visibleCount = getVisibleCount();
        rows.forEach((row, i) => {
            row.style.display = i < visibleCount ? '' : 'none';
        });
    };

    const show = () => {
        rows.forEach((row) => {
            row.style.display = '';
        });
    };

    const updateButton = () => {
        const visibleCount = getVisibleCount();
        button.style.display = rows.length > visibleCount ? '' : 'none';
    };

    let isExpanded = false;

    const init = () => {
        updateButton();
        if (!isExpanded && rows.length > getVisibleCount()) {
            hide();
        }
    };

    init();

    button.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            show();
            button.textContent = 'Скрыть все';
        } else {
            hide();
            button.textContent = 'Показать ещё';
        }
    });

    window.addEventListener('resize', () => {
        if (!isExpanded) {
            hide();
        }
        updateButton();
    });
};