import products from '../../data/products.json';

export const initSearch = (lenis) => {
	const searchTrigger = document.querySelector('.icon-box[data-label="Поиск"]');
	const searchDrawer = document.getElementById('search-drawer');
	const searchInput = document.getElementById('search-input');
	const searchResults = document.getElementById('search-results');
	const closeSearchBtn = document.getElementById('close-search');
	const menuOverlay = document.getElementById('menu-overlay');
	const menuDrawer = document.getElementById('menu-drawer');

	const resultTemplate = document.getElementById('search-result-template');

	if (!searchTrigger || !searchDrawer || !resultTemplate) return;

	let debounceTimer;

	// Переменные для пагинации (скролл)
	let currentResults = [];
	let currentRenderIndex = 0;
	const ITEMS_PER_LOAD = 6; // Выдавать по 6 товаров

	const openSearch = () => {
		if (menuDrawer && menuDrawer.classList.contains('open')) {
			menuDrawer.classList.remove('open');
		}

		searchDrawer.classList.add('open');
		menuOverlay.classList.add('open');

		document.documentElement.classList.add('search-open');
		document.body.classList.add('search-open');

		// Говорим Ленису игнорировать события мыши внутри этого дравера
		searchDrawer.setAttribute('data-lenis-prevent', '');

		if (lenis) lenis.stop();
		setTimeout(() => searchInput.focus(), 400);
	};

	const closeSearch = () => {
		searchDrawer.classList.remove('open');
		if (!menuDrawer || !menuDrawer.classList.contains('open')) {
			menuOverlay.classList.remove('open');
		}

		document.documentElement.classList.remove('search-open');
		document.body.classList.remove('search-open');

		// Убираем запрет, когда закрыли поиск
		searchDrawer.removeAttribute('data-lenis-prevent');

		if (lenis) lenis.start();

		searchInput.value = '';
		currentResults = [];
		currentRenderIndex = 0;

		const templates = searchResults.querySelectorAll('template');
		searchResults.innerHTML = '';
		templates.forEach((tmpl) => searchResults.appendChild(tmpl));
	};

	// Функция добавления порции товаров в DOM
	const appendItems = () => {
		const end = Math.min(
			currentRenderIndex + ITEMS_PER_LOAD,
			currentResults.length
		);

		for (let i = currentRenderIndex; i < end; i++) {
			const product = currentResults[i];

			const clone = resultTemplate.content.cloneNode(true);

			const item = clone.querySelector('.search-result-item');
			const preview = product.variants?.find((v) => v.catalogImage);
			const img = clone.querySelector('.search-result-item__img');
			const title = clone.querySelector('.search-result-item__title');
			const desc = clone.querySelector('.search-result-item__desc');
			const price = clone.querySelector('.search-result-item__price');

			item.href = `/product.html?slug=${product.slug}`;
			// Используем глобальный индекс i для правильной каскадной анимации
			item.style.animationDelay = `${i * 0.05}s`;

			img.src = preview ? preview.catalogImage : '';
			img.alt = product.title;

			title.textContent = product.title;
			desc.textContent = product.description;
			price.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;

			searchResults.appendChild(clone);
		}

		currentRenderIndex = end;
	};

	const renderResults = (query) => {
		// Очищаем старое
		currentResults = [];
		currentRenderIndex = 0;
		const templates = searchResults.querySelectorAll('template');
		searchResults.innerHTML = '';
		templates.forEach((tmpl) => searchResults.appendChild(tmpl));

		if (!query.trim()) return;

		// Фильтруем
		currentResults = products.filter(
			(p) =>
				p.title.toLowerCase().includes(query.toLowerCase()) ||
				p.description.toLowerCase().includes(query.toLowerCase())
		);

		if (currentResults.length === 0) {
			searchResults.insertAdjacentHTML(
				'beforeend',
				'<div class="search-drawer__empty">Ничего не найдено</div>'
			);
			return;
		}

		// Рендерим первые 6 штук
		appendItems();
	};

	// --- События ---
	searchTrigger.addEventListener('click', (e) => {
		e.stopPropagation();
		if (!searchDrawer.classList.contains('open')) openSearch();
	});

	closeSearchBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		closeSearch();
	});

	menuOverlay.addEventListener('click', () => {
		if (searchDrawer.classList.contains('open')) {
			closeSearch();
		}
	});

	searchInput.addEventListener('input', (e) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			renderResults(e.target.value);
		}, 150);
	});

	// ИСПРАВЛЕНИЕ 2: Скролл для подгрузки следующих товаров
	searchResults.addEventListener('scroll', () => {
		const { scrollTop, scrollHeight, clientHeight } = searchResults;

		// Если скролл достиг низа (с небольшим отступом в 50px) и есть еще товары
		if (scrollHeight - scrollTop - clientHeight < 50) {
			if (currentRenderIndex < currentResults.length) {
				appendItems();
			}
		}
	});

	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && searchDrawer.classList.contains('open')) {
			closeSearch();
		}
	});
};
