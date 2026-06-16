export function handleMobileLayout() {
	const isMobile = window.innerWidth <= 600;

	const galleryItems = document.querySelectorAll('.gallery-grid__item');
	const accordionItems = document.querySelectorAll('.accordion__item');
	const galleryGrid = document.querySelector('.gallery-grid');

	if (!galleryItems.length || !accordionItems.length || !galleryGrid) return;

	if (isMobile) {
		// ДЛЯ МОБИЛЬНОЙ ВЕРСИИ

		// 1. Перемещаем первые 3 картинки после "Описания" (индекс 0)
		// Важно: вставляем в обратном порядке (3, 2, 1), чтобы в итоге получить 1, 2, 3
		// так как after вставляет элемент сразу после цели
		const descBlock = accordionItems[0]; // Описание
		if (descBlock) {
			if (galleryItems[2]) descBlock.after(galleryItems[2]);
			if (galleryItems[1]) descBlock.after(galleryItems[1]);
			if (galleryItems[0]) descBlock.after(galleryItems[0]);
		}

		// 2. Перемещаем остальные картинки (с 4-й и далее) после "Параметров" (индекс 3)
		const paramsBlock = accordionItems[3]; // Параметры
		if (paramsBlock) {
			// Проходим по оставшимся картинкам с конца, чтобы сохранить порядок
			for (let i = galleryItems.length - 1; i >= 3; i--) {
				paramsBlock.after(galleryItems[i]);
			}
		}
	} else {
		// --- ВОЗВРАТ НА ДЕСКТОП ---

		// Если экран стал большим, возвращаем все картинки обратно в контейнер галереи
		galleryItems.forEach((item) => {
			galleryGrid.appendChild(item);
		});
	}
}
