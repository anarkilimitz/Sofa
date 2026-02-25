document.addEventListener('DOMContentLoaded', () => {
	// Бургер
	const menuTriggers = document.querySelectorAll('.menu-trigger');
	const closeMenu = document.getElementById('close-menu');
	const menuDrawer = document.getElementById('menu-drawer');
	const menuOverlay = document.getElementById('menu-overlay');

	const toggleMenu = () => {
		menuDrawer.classList.toggle('open');
		menuOverlay.classList.toggle('open');
	};

	const closeMenuFunc = () => {
		menuDrawer.classList.remove('open');
		menuOverlay.classList.remove('open');
	};

	menuTriggers.forEach((trigger) => {
		trigger.addEventListener('click', toggleMenu);
	});

	if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
	if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menuDrawer.classList.contains('open')) {
			closeMenuFunc();
		}
	});
	// склейка карусели для адаптивности
	const initCarousel = () => {
		const carouselContainer = document.querySelector('.carousel-container');
		const carouselWrapper = document.querySelector('.carousel-wrapper');
		if (!carouselContainer || !carouselWrapper) return;

		const initialItems = Array.from(carouselWrapper.children);
		const cycleItemsCount = Math.floor(initialItems.length / 2);
		if (cycleItemsCount === 0) return;

		const cycleTemplate = initialItems.slice(0, cycleItemsCount);

		const syncCarouselTrack = () => {
			const firstItem = carouselWrapper.children[0];
			const lastCycleItem = carouselWrapper.children[cycleItemsCount - 1];
			if (!firstItem || !lastCycleItem) return;

			const firstRect = firstItem.getBoundingClientRect();
			const lastRect = lastCycleItem.getBoundingClientRect();
			const cycleWidth = lastRect.right - firstRect.left;
			if (cycleWidth <= 0) return;

			carouselWrapper.style.setProperty(
				'--carousel-scroll-distance',
				`-${cycleWidth}px`
			);

			while (
				carouselWrapper.scrollWidth <
				carouselContainer.clientWidth + cycleWidth
			) {
				cycleTemplate.forEach((item) => {
					carouselWrapper.appendChild(item.cloneNode(true));
				});
			}
		};

		syncCarouselTrack();

		let resizeTimer;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(syncCarouselTrack, 120);
		});
	};

	initCarousel();
});
