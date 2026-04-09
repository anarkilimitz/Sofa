import gsap from 'gsap';

export function initTabs(render, products) {
	const tabs = document.querySelectorAll('.tab');

	if (!tabs.length) return;

	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			const category = tab.dataset.category;

			// активный таб
			tabs.forEach((t) => t.classList.remove('active'));
			tab.classList.add('active');

			// текущие карточки (которые уже в DOM)
			const currentCards = document.querySelectorAll('.catalog__card');

			// анимация исчезновения
			gsap.to(currentCards, {
				opacity: 0,
				scale: 0.9,
				duration: 0.3,
				ease: 'power2.in',
				onComplete: () => {
					// фильтрация данных
					const filtered =
						category === 'all'
							? products
							: products.filter((p) => p.category === category);

					// перерисовка каталога
					render(filtered);

					// получение уже НОВЫХ карточек
					const newCards = document.querySelectorAll('.catalog__card');

					if (!newCards.length) return;

					// сброс перед анимацией
					gsap.set(newCards, {
						opacity: 0,
						scale: 0.9,
					});

					// появление
					gsap.to(newCards, {
						opacity: 1,
						scale: 1,
						duration: 0.4,
						stagger: 0.08,
						ease: 'power2.out',
						clearProps: 'opacity,transform',
					});
				},
			});
		});
	});
}
