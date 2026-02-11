export default function initFaqAccordion() {
    const accordions = document.querySelectorAll('[data-accordion]')
    if (!accordions.length) return;

    accordions.forEach((accordion) => {
        const button = accordion.querySelector('[data-accordion-button]')
        const content = accordion.querySelector('[data-accordion-content]')

        if (!button || !content) {
            return
        }

        button.addEventListener('click', () => {
            const isOpen = accordion.classList.contains('is-open')

            // Закрываем все остальные открытые аккордеоны
            document
                .querySelectorAll('[data-accordion].is-open')
                .forEach((openAcc) => {
                    if (openAcc !== accordion) {
                        openAcc.classList.remove('is-open')
                        const openContent = openAcc.querySelector(
                            '[data-accordion-content]'
                        )
                        if (openContent) {
                            openContent.style.maxHeight = null
                        }
                    }
                })

            // Переключаем текущий аккордеон
            if (isOpen) {
                accordion.classList.remove('is-open')
                content.style.maxHeight = null
            } else {
                accordion.classList.add('is-open')
                content.style.maxHeight = content.scrollHeight + 'px'
            }
        })
    })
}