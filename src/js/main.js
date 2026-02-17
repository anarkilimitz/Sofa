document.addEventListener('DOMContentLoaded', () => {
	const menuTrigger = document.getElementById('menu-trigger');
	const closeMenu = document.getElementById('close-menu');
	const menuDrawer = document.getElementById('menu-drawer');
	const menuOverlay = document.getElementById('menu-overlay');

	const toggleMenu = () => {
		menuDrawer.classList.toggle('open');
		menuOverlay.classList.toggle('open');
	};

	if (menuTrigger) menuTrigger.addEventListener('click', toggleMenu);
	if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
	if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);
});
