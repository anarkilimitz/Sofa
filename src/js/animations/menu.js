import { animateMenuLinks } from './menuAnimation';

export const initMenu = (lenis) => {
	const menuTriggers = document.querySelectorAll('.menu-trigger');
	const closeMenu = document.getElementById('close-menu');
	const menuDrawer = document.getElementById('menu-drawer');
	const menuOverlay = document.getElementById('menu-overlay');

	if (!menuDrawer || !menuOverlay) return;

	const toggleMenu = () => {
		const isOpen = menuDrawer.classList.contains('open');

		if (!isOpen) {
			// открытие
			menuDrawer.classList.add('open');
			menuOverlay.classList.add('open');
			if (lenis) lenis.stop();
			animateMenuLinks(true);
		} else {
			// закрытие
			menuDrawer.classList.remove('open');
			menuOverlay.classList.remove('open');
			if (lenis) lenis.start();
			animateMenuLinks(false);
		}
	};

	// закрытие меню
	const closeMenuFunc = () => {
		if (menuDrawer.classList.contains('open')) {
			menuDrawer.classList.remove('open');
			menuOverlay.classList.remove('open');
			if (lenis) lenis.start();
			animateMenuLinks(false);
		}
	};

	// события
	menuTriggers.forEach((trigger) =>
		trigger.addEventListener('click', toggleMenu)
	);

	if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
	menuOverlay.addEventListener('click', toggleMenu);

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeMenuFunc();
		}
	});
	// Добавление активного класса для точки в меню!
	const setActiveMenuItem = () => {
		const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');

		const links = document.querySelectorAll('.menu-item, .menu-link');

		links.forEach((link) => {
			const href = link.getAttribute('href');
			if (!href) return;

			const normalizedHref = href.replace(/\/index\.html$/, '/');

			if (normalizedHref === currentPath) {
				link.classList.add('active');
			}
		});
	};

	setActiveMenuItem();
};
