export function handleMobileLayout() {
	const isMobile = window.innerWidth <= 600;
	const galleryGrid = document.querySelector('.gallery-grid');
	const accordionItems = document.querySelectorAll('.accordion__item');

	if (!galleryGrid) return;
	
	const currentItems = Array.from(galleryGrid.children).filter((child) =>
		child.classList.contains('gallery-grid__item')
	);

	if (!currentItems.length) return;
	
	if (!isMobile) {
		currentItems.forEach((item) => galleryGrid.appendChild(item));
		return;
	}
	
	const descBlock = accordionItems[0];
	const paramsBlock =
		accordionItems[3] || accordionItems[accordionItems.length - 1];

	// 1. Первые 3 картинки переносим под первый аккордеон (описание)
	if (descBlock) {
		currentItems
			.slice(0, 3)
			.reverse()
			.forEach((item) => descBlock.after(item));
	}

	// 2. Оставшиеся картинки переносим под блок параметров
	if (paramsBlock && currentItems.length > 3) {
		currentItems
			.slice(3)
			.reverse()
			.forEach((item) => paramsBlock.after(item));
	}
}
