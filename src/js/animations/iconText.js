// для иконок - корзина, профиль, посик

export function initNavIconLabels() {
	const navIconsBlocks = document.querySelectorAll('.nav-icons');

	navIconsBlocks.forEach((navIcons) => {
		const icons = navIcons.querySelectorAll('.icon-box');

		icons.forEach((icon) => {
			icon.addEventListener('mouseenter', () => {
				navIcons.dataset.activeLabel = icon.dataset.label;
				navIcons.classList.add('show-label');
			});

			icon.addEventListener('mouseleave', () => {
				navIcons.classList.remove('show-label');
			});
		});
	});
}
