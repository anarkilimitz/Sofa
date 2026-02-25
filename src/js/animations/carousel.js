export const initCarousel = () => {
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

		const cycleWidth =
			lastCycleItem.getBoundingClientRect().right -
			firstItem.getBoundingClientRect().left;
		if (cycleWidth <= 0) return;

		carouselWrapper.style.setProperty(
			'--carousel-scroll-distance',
			`-${cycleWidth}px`
		);

		while (
			carouselWrapper.scrollWidth <
			carouselContainer.clientWidth + cycleWidth
		) {
			cycleTemplate.forEach((item) =>
				carouselWrapper.appendChild(item.cloneNode(true))
			);
		}
	};

	syncCarouselTrack();
	window.addEventListener('resize', syncCarouselTrack);
};
