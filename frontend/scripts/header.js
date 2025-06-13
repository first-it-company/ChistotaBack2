export function initHeader() {
    const root = document.querySelector('.header')
    if (!root) return

    const overlay = root.querySelector('.header__overlay')
    const burgerButton = root.querySelector('.header__burger-button')

    const STATE_CLASSES = {
        isActive: 'is-active',
        isLock: 'is-lock',
        navUp: 'nav-up',
    }

    const onBurgerButtonClick = () => {
        burgerButton.classList.toggle(STATE_CLASSES.isActive)
        overlay.classList.toggle(STATE_CLASSES.isActive)
        document.documentElement.classList.toggle(STATE_CLASSES.isLock)
    }

    burgerButton.addEventListener('click', onBurgerButtonClick)

    let lastScroll = 0
    const scrollThreshold = 100

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY

        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            root.classList.add(STATE_CLASSES.navUp)
        } else {
            root.classList.remove(STATE_CLASSES.navUp)
        }

        lastScroll = currentScroll
    })
}
