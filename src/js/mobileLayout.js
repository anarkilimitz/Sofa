export function handleMobileLayout() {
	const isMobile = window.innerWidth <= 600;

	const galleryGrid = document.querySelector('.gallery-grid');
	const accordionItems = document.querySelectorAll('.accordion__item');

	if (!galleryGrid || !accordionItems.length) return;

	// =====================================================
	// ВСЕГДА сначала возвращаем картинки обратно в галерею
	// =====================================================

	const movedItems = document.querySelectorAll('.gallery-grid__item');

	movedItems.forEach((item) => {
		galleryGrid.appendChild(item);
	});

	// Если десктоп — на этом всё
	if (!isMobile) return;

	// Получаем уже "чистый" список после возврата
	const galleryItems = [...galleryGrid.children];

	const descBlock = accordionItems[0];
	const paramsBlock = accordionItems[3];

	// Первые три
	if (descBlock) {
		galleryItems
			.slice(0, 3)
			.reverse()
			.forEach((item) => descBlock.after(item));
	}

	// Остальные
	if (paramsBlock) {
		galleryItems
			.slice(3)
			.reverse()
			.forEach((item) => paramsBlock.after(item));
	}
}
