export function initReviewsScroll() {
    const main = document.querySelector('.reviews__main');
    const columns = main?.querySelectorAll('.reviews__column');
    const [upBtn, downBtn] = main?.querySelectorAll('.reviews__control-button') || [];

    if (!main || !columns?.length || !upBtn || !downBtn) return;

    const VISIBLE_H = 700;
    let offset = 0;
    let maxOffset = 0;

    function calcMax() {
        const tallest = Math.max(...[...columns].map(c => c.scrollHeight));
        maxOffset = Math.max(0, tallest - VISIBLE_H);
    }

    function getStep() {
        const card = columns[0]?.querySelector('.reviews__card');
        if (!card) return 200;
        return card.offsetHeight + parseInt(getComputedStyle(card).marginBottom || 0);
    }

    function applyOffset() {
        columns.forEach(col => {
            col.style.transform = `translateY(-${offset}px)`;
        });
        updateButtons();
    }

    function updateButtons() {
        upBtn.classList.toggle('is-disabled', offset <= 0);
        downBtn.classList.toggle('is-disabled', offset >= maxOffset);
    }

    upBtn.addEventListener('click', () => {
        offset = Math.max(0, offset - getStep());
        applyOffset();
    });

    downBtn.addEventListener('click', () => {
        offset = Math.min(maxOffset, offset + getStep());
        applyOffset();
    });

    Promise.all(
        [...main.querySelectorAll('img')].map(img =>
            img.complete ? Promise.resolve() : new Promise(r => {
                img.onload = r;
                img.onerror = r;
            })
        )
    ).then(() => {
        calcMax();
        applyOffset();
    });

    window.addEventListener('resize', () => {
        calcMax();
        offset = Math.min(offset, maxOffset);
        applyOffset();
    });
}
