import gsap from 'gsap';

export const animateMenuLinks = (isOpen) => {
	const links = document.querySelectorAll('.menu-nav .menu-link');

	if (isOpen) {
		// Появление: вылетают чуть снизу, меняют прозрачность
		gsap.fromTo(
			links,
			{
				y: 20,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				stagger: 0.1,
				ease: 'power2.out',
				delay: 0.2, // небольшая задержка, чтобы само меню успело начать открываться
			}
		);
	} else {
		// Исчезновение
		gsap.to(links, {
			opacity: 0,
			y: -10,
			duration: 0.2,
			overwrite: true,
		});
	}
};
