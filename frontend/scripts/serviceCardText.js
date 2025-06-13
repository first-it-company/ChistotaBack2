export function initExpandableText() {
    const texts = document.querySelectorAll('.service__card-subheader');
    const charLimit = 170;

    if (window.innerWidth > 768) return;

    texts.forEach(text => {
        const fullText = text.textContent.trim();

        if (fullText.length > charLimit) {
            text.dataset.fullText = fullText;
            text.dataset.shortText = fullText.slice(0, charLimit) + '...';
            text.textContent = text.dataset.shortText;
            text.classList.add('collapsed');

            text.addEventListener('click', () => {
                const isExpanded = text.classList.toggle('expanded');
                text.classList.toggle('collapsed', !isExpanded);
                text.textContent = isExpanded ? text.dataset.fullText : text.dataset.shortText;
            });
        }
    });
}
