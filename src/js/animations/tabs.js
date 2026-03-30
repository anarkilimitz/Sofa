import gsap from 'gsap';

export function initTabs() {
	const tabs = document.querySelectorAll('.tab');
	const cards = document.querySelectorAll('.catalog__card');

	if (!tabs.length || !cards.length) return;

	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			const targetCategory = tab.getAttribute('data-category');

			// 1. Управление активным классом
			tabs.forEach((t) => t.classList.remove('active'));
			tab.classList.add('active');

			// 2. Исчезновение всех текущих карточек
			gsap.to(cards, {
				opacity: 0,
				scale: 0.9,
				duration: 0.3,
				ease: 'power2.in',
				onComplete: () => {
					// 3. Логика фильтрации (display: block/none)
					cards.forEach((card) => {
						const cardCategory = card.getAttribute('data-category');

						if (targetCategory === 'all' || cardCategory === targetCategory) {
							card.style.display = 'block';
						} else {
							card.style.display = 'none';
						}
					});

					// 4. Выбираем только те карточки, которые стали видимыми
					const visibleCards = Array.from(cards).filter(
						(card) => card.style.display !== 'none'
					);

					// Если видимых карточек нет (например, пустая категория), выходим
					if (visibleCards.length === 0) return;

					// 5. Сбрасываем их состояние перед анимацией появления
					gsap.set(visibleCards, { opacity: 0, scale: 0.9 });

					// 6. Анимация появления отфильтрованных карточек
					gsap.to(visibleCards, {
						opacity: 1,
						scale: 1,
						duration: 0.4,
						stagger: 0.08,
						ease: 'power2.out',
						// clearProps удаляет инлайновые стили GSAP (opacity, transform),
						// чтобы они не перебивали твои стили из SCSS (например, :hover)
						clearProps: 'opacity,scale,transform',
					});
				},
			});
		});
	});
}
