import { animateMenuLinks } from './menuAnimation';

export const initMenu = () => {
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
			animateMenuLinks(true);
		} else {
			// закрытие
			menuDrawer.classList.remove('open');
			menuOverlay.classList.remove('open');
			animateMenuLinks(false);
		}
	};

	// закрытие меню
	const closeMenuFunc = () => {
		if (menuDrawer.classList.contains('open')) {
			menuDrawer.classList.remove('open');
			menuOverlay.classList.remove('open');
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
};
