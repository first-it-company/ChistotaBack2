export function initReviewsScroll() {
    const main = document.querySelector('.reviews__main');
    const columns = main?.querySelectorAll('.reviews__column');
    const [upBtn, downBtn] = main?.querySelectorAll('.reviews__control-button') || [];

    if (!main || !columns?.length || !upBtn || !downBtn) return;

    const VISIBLE_H = 700;
    let offset = 0;
    let maxOffset = 0;
    let isCalculating = false;
    let resizeTimeout = null;

    function calcMax() {
        try {
            const validColumns = [...columns].filter(c => c && c.isConnected);
            if (!validColumns.length) {
                maxOffset = 0;
                return;
            }

            const tallest = Math.max(...validColumns.map(c => c.scrollHeight || 0));
            maxOffset = Math.max(0, tallest - VISIBLE_H);

            if (offset > maxOffset) {
                offset = maxOffset;
            }
        } catch (error) {
            console.warn('Error calculating max offset:', error);
            maxOffset = 0;
        }
    }

    function getStep() {
        try {
            const card = columns[0]?.querySelector('.reviews__card');
            if (!card || !card.isConnected) return 200;

            const marginBottom = parseInt(getComputedStyle(card).marginBottom || 0);
            const step = card.offsetHeight + marginBottom;

            return step > 0 ? step : 200;
        } catch (error) {
            console.warn('Error getting step:', error);
            return 200;
        }
    }

    function applyOffset() {
        if (isCalculating) return;

        try {
            offset = Math.max(0, Math.min(offset, maxOffset));

            columns.forEach(col => {
                if (col && col.isConnected) {
                    col.style.transform = `translateY(-${offset}px)`;
                }
            });
            updateButtons();
        } catch (error) {
            console.warn('Error applying offset:', error);
        }
    }

    function updateButtons() {
        if (!upBtn || !downBtn) return;

        try {
            const isAtTop = offset <= 0;
            const isAtBottom = offset >= maxOffset || maxOffset === 0;

            upBtn.classList.toggle('is-disabled', isAtTop);
            downBtn.classList.toggle('is-disabled', isAtBottom);

            upBtn.disabled = isAtTop;
            downBtn.disabled = isAtBottom;
        } catch (error) {
            console.warn('Error updating buttons:', error);
        }
    }

    function handleUpClick(e) {
        e.preventDefault();
        if (upBtn.classList.contains('is-disabled') || offset <= 0) return;

        offset = Math.max(0, offset - getStep());
        applyOffset();
    }

    function handleDownClick(e) {
        e.preventDefault();
        if (downBtn.classList.contains('is-disabled') || offset >= maxOffset) return;

        offset = Math.min(maxOffset, offset + getStep());
        applyOffset();
    }

    upBtn.addEventListener('click', handleUpClick);
    downBtn.addEventListener('click', handleDownClick);

    function waitForImages() {
        const images = [...main.querySelectorAll('img')];

        if (!images.length) {
            return Promise.resolve();
        }

        const imagePromises = images.map(img => {
            if (img.complete) {
                return Promise.resolve();
            }

            return new Promise(resolve => {
                const timeout = setTimeout(() => {
                    resolve();
                }, 5000);

                img.onload = () => {
                    clearTimeout(timeout);
                    resolve();
                };
                img.onerror = () => {
                    clearTimeout(timeout);
                    resolve();
                };
            });
        });

        return Promise.all(imagePromises);
    }

    isCalculating = true;
    waitForImages()
        .then(() => {
            calcMax();
            applyOffset();
        })
        .finally(() => {
            isCalculating = false;
        });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calcMax();
            offset = Math.min(offset, maxOffset);
            applyOffset();
        }, 150);
    });

    return () => {
        upBtn.removeEventListener('click', handleUpClick);
        downBtn.removeEventListener('click', handleDownClick);
        clearTimeout(resizeTimeout);
    };
}