import Odometer from 'odometer';
import 'odometer/themes/odometer-theme-default.css';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initOdometer() {
    const odometers = document.querySelectorAll('[data-odometer]');

    odometers.forEach(element => {
        const targetValue = parseInt(element.dataset.odometer);
        const duration = parseInt(element.dataset.duration) || 2000;

        const od = new Odometer({
            el: element,
            value: 0,
            duration: duration,
            format: element.dataset.format || '(,ddd)',
        });

        ScrollTrigger.create({
            trigger: element,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                od.update(targetValue);
            }
        });
    });
}