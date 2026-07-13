import { animateMenuLinks } from './menuAnimation';

export const initMenu = (lenis) => {
	const menuTriggers = document.querySelectorAll('.menu-trigger');
	const closeMenu = document.getElementById('close-menu');
	const menuDrawer = document.getElementById('menu-drawer');
	const menuOverlay = document.getElementById('menu-overlay');

	if (!menuDrawer || !menuOverlay) return;

	const toggleMenu = () => {
		const isOpen = menuDrawer.classList.contains('open');

		if (!isOpen) {
			// открытие
			menuDrawer.classList.add('open');
			menuOverlay.classList.add('open');
			if (lenis) lenis.stop();
			animateMenuLinks(true);
		} else {
			// закрытие
			menuDrawer.classList.remove('open');
			menuOverlay.classList.remove('open');
			if (lenis) lenis.start();
			animateMenuLinks(false);
		}
	};

	// закрытие меню
	const closeMenuFunc = () => {
		if (menuDrawer.classList.contains('open')) {
			menuDrawer.classList.remove('open');
			menuOverlay.classList.remove('open');
			if (lenis) lenis.start();
			animateMenuLinks(false);
		}
	};

	// события
	menuTriggers.forEach((trigger) =>
		trigger.addEventListener('click', toggleMenu)
	);

	if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

	// Защита от конфликта с поиском
	menuOverlay.addEventListener('click', (e) => {
		const searchDrawer = document.getElementById('search-drawer');
		// Если открыт поиск — просто выходим, не трогаем бургер
		if (searchDrawer && searchDrawer.classList.contains('open')) return;

		toggleMenu();
	});

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeMenuFunc();
		}
	});
	// Добавление активного класса для точки в меню!
	const setActiveMenuItem = () => {
		const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');

		const links = document.querySelectorAll('.menu-item, .menu-link');

		// элемент с текстом в бургере
		// .menu-trigger > span (тот, который после .burger-icon)
		const triggerTextNode = document.querySelector('.menu-trigger > span');

		let currentPageName = null;

		links.forEach((link) => {
			const href = link.getAttribute('href');
			if (!href) return;
			// Нормализуем ссылку (убираем index.html для сравнения)
			const normalizedHref = href.replace(/\/index\.html$/, '/');

			if (normalizedHref === currentPath) {
				link.classList.add('active');

				// Запоминаем текст найденной активной ссылки
				currentPageName = link.textContent.trim();
			}
		});

		// ЛОГИКА ДЛЯ СТРАНИЦЫ ТОВАРА
		if (!currentPageName && triggerTextNode) {
			// проверка, есть ли у body специальный атрибут
			const bodyPageName = document.body.getAttribute('data-page-name');
			if (bodyPageName) {
				currentPageName = bodyPageName;
			} else {
				currentPageName = 'Карточка';
			}
		}

		// Если элемент для текста найден, обновляем его содержимое
		if (triggerTextNode) {
			triggerTextNode.textContent = currentPageName;
		}
	};

	setActiveMenuItem();
};
