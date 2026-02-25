export const initMenu = () => {
	const menuTriggers = document.querySelectorAll('.menu-trigger');
	const closeMenu = document.getElementById('close-menu');
	const menuDrawer = document.getElementById('menu-drawer');
	const menuOverlay = document.getElementById('menu-overlay');

	if (!menuDrawer || !menuOverlay) return;

	const toggleMenu = () => {
		menuDrawer.classList.toggle('open');
		menuOverlay.classList.toggle('open');
	};

	const closeMenuFunc = () => {
		menuDrawer.classList.remove('open');
		menuOverlay.classList.remove('open');
	};

	menuTriggers.forEach((trigger) =>
		trigger.addEventListener('click', toggleMenu)
	);
	if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
	menuOverlay.addEventListener('click', toggleMenu);

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menuDrawer.classList.contains('open')) {
			closeMenuFunc();
		}
	});
};
