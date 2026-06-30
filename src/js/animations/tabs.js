import gsap from 'gsap';

export function initTabs(render, products) {
	const tabs = document.querySelectorAll('.tab');
	const filterTrigger = document.getElementById('filter-trigger');
	const filterPopup = document.getElementById('filter-popup');
	const filterOverlay = document.getElementById('filter-overlay');
	const filterClose = document.getElementById('filter-close');
	const filterApply = document.getElementById('filter-apply');
	const filterReset = document.getElementById('filter-reset');
	const filterItems = document.querySelectorAll('.filter-popup__item');

	// Текущее состояние
	let activeCategory = 'all';
	let pendingCategory = 'all'; // то, что выбрали в поп-апе, но ещё не применили

	// десктопные табы
	if (tabs.length) {
		tabs.forEach((tab) => {
			tab.addEventListener('click', () => {
				const category = tab.dataset.category;
				activeCategory = category;
				pendingCategory = category;

				tabs.forEach((t) => t.classList.remove('active'));
				tab.classList.add('active');

				animateSwitch(category);
			});
		});
	}

	// мобильный поп-ап

	function openPopup() {
		pendingCategory = activeCategory;
		highlightPopupItem(pendingCategory);
		filterOverlay.classList.add('active');
		filterPopup.classList.add('active');
		document.body.style.overflow = 'hidden';
	}

	function closePopup() {
		filterOverlay.classList.remove('active');
		filterPopup.classList.remove('active');
		document.body.style.overflow = '';
	}

	function highlightPopupItem(category) {
		filterItems.forEach((item) => {
			if (item.dataset.category === category) {
				item.classList.add('selected');
			} else {
				item.classList.remove('selected');
			}
		});
	}

	if (filterTrigger) {
		filterTrigger.addEventListener('click', openPopup);
	}

	if (filterClose) {
		filterClose.addEventListener('click', closePopup);
	}

	if (filterOverlay) {
		filterOverlay.addEventListener('click', closePopup);
	}

	// клик по пункту в поп-апе
	filterItems.forEach((item) => {
		item.addEventListener('click', () => {
			pendingCategory = item.dataset.category;
			highlightPopupItem(pendingCategory);
		});
	});

	// применить
	if (filterApply) {
		filterApply.addEventListener('click', () => {
			activeCategory = pendingCategory;

			// синхронизируем десктопные табы
			tabs.forEach((t) => {
				t.classList.remove('active');
				if (t.dataset.category === activeCategory) {
					t.classList.add('active');
				}
			});

			closePopup();
			animateSwitch(activeCategory);
		});
	}

	// сбросить всё
	if (filterReset) {
		filterReset.addEventListener('click', () => {
			pendingCategory = 'all';
			highlightPopupItem('all');
		});
	}

	// общая анимация переключения
	function animateSwitch(category) {
		const currentCards = document.querySelectorAll('.catalog__card');

		gsap.to(currentCards, {
			opacity: 0,
			scale: 0.9,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => {
				const filtered =
					category === 'all'
						? products
						: products.filter((p) => p.category === category);

				render(filtered);

				const newCards = document.querySelectorAll('.catalog__card');
				if (!newCards.length) return;

				gsap.set(newCards, {
					opacity: 0,
					scale: 0.9,
				});

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
	}
}
