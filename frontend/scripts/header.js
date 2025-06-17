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

    const openOverlay = () => {
        burgerButton.classList.add(STATE_CLASSES.isActive)
        overlay.classList.add(STATE_CLASSES.isActive)
        document.documentElement.classList.add(STATE_CLASSES.isLock)
        root.classList.remove(STATE_CLASSES.navUp)
    }

    const closeOverlay = () => {
        burgerButton.classList.remove(STATE_CLASSES.isActive)
        overlay.classList.remove(STATE_CLASSES.isActive)
        document.documentElement.classList.remove(STATE_CLASSES.isLock)
        root.classList.remove(STATE_CLASSES.navUp)
    }

    burgerButton.addEventListener('click', () => {
        if (overlay.classList.contains(STATE_CLASSES.isActive)) {
            closeOverlay()
        } else {
            openOverlay()
        }
    })

    document.addEventListener('click', (event) => {
        const target = event.target
        if (
            overlay.classList.contains(STATE_CLASSES.isActive) &&
            !overlay.contains(target) &&
            !burgerButton.contains(target)
        ) {
            closeOverlay()
        }
    })

    let lastScroll = 0
    const scrollThreshold = 100

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY

        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            root.classList.add(STATE_CLASSES.navUp)

            if (overlay.classList.contains(STATE_CLASSES.isActive)) {
                closeOverlay()
            }
        } else {
            root.classList.remove(STATE_CLASSES.navUp)
        }

        lastScroll = currentScroll
    })
}

