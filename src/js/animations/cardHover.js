import gsap from 'gsap';

export const initCardHover = () => {
	// Сначала удаляем все старые обработчики, чтобы не было дублей и утечек
	document
		.querySelectorAll(
			'.showcase-card, .specifics-card, .link-catalog, .order-badge'
		)
		.forEach((card) => {
			card.removeEventListener('mousemove', card._hoverHandler || (() => {}));
			card.removeEventListener('mouseleave', card._leaveHandler || (() => {}));
		});

	const allCards = document.querySelectorAll(
		'.showcase-card, .specifics-card, .link-catalog, .order-badge'
	);

	allCards.forEach((card) => {
		// Сохраняем функции на элементе, чтобы потом их можно было удалить
		card._hoverHandler = (e) => {
			const { clientX, clientY } = e;
			const { left, top, width, height } = card.getBoundingClientRect();

			const moveX = (clientX - (left + width / 2)) / (width / 2);
			const moveY = (clientY - (top + height / 2)) / (height / 2);

			gsap.to(card, {
				rotateY: moveX * 5,
				rotateX: -moveY * 5,
				ease: 'power2.out',
				duration: 0.2,
				transformPerspective: 1000,
			});
		};

		card._leaveHandler = () => {
			gsap.to(card, {
				rotateX: 0,
				rotateY: 0,
				ease: 'power2.out',
				duration: 0.3,
			});
		};

		card.addEventListener('mousemove', card._hoverHandler);
		card.addEventListener('mouseleave', card._leaveHandler);
	});
};
