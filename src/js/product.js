import products from '../data/products.json';

export const initProduct = () => {
	const galleryContainer = document.getElementById('prod-gallery');
	if (!galleryContainer) return; // Мы не на странице товара

	const urlParams = new URLSearchParams(window.location.search);
	const productSlug = urlParams.get('slug');

	// Если slug отсутствует или пустой
	if (!productSlug) {
		redirectTo404();
		return;
	}

	const product = products.find((p) => p.slug === productSlug);

	// Если товар не найден — редирект на настоящую страницу 404
	if (!product) {
		redirectTo404();
		return;
	}

	// Товар найден — рендерим нормально
	renderProductData(product);

	// --- ИНТЕРАКТИВ ---

	// 1. Аккордеон
	const accordionHeaders = document.querySelectorAll('.accordion__header');
	accordionHeaders.forEach((header) => {
		header.onclick = () => {
			// Используем упрощенный клик
			header.parentElement.classList.toggle('accordion__item-active');
		};
	});

	// 2. Логика выбора цвета
	const colorPicker = document.getElementById('colorPicker');
	if (colorPicker) {
		const selectedArea = colorPicker.querySelector('.color-select__selected');
		const dropdown = colorPicker.querySelector('.color-select__dropdown');
		const options = colorPicker.querySelectorAll('.color-select__option');

		selectedArea.addEventListener('click', (e) => {
			e.stopPropagation();
			dropdown.classList.toggle('color-select__dropdown-open');
			selectedArea.classList.toggle('color-select__selected-open');
		});

		options.forEach((option) => {
			option.addEventListener('click', () => {
				const nameEl = selectedArea.querySelector('.color-select__name');
				const newName = option.dataset.name;
				const newIcon = option.dataset.icon;

				nameEl.style.opacity = '0';
				setTimeout(() => {
					nameEl.textContent = newName;
					nameEl.style.opacity = '1';
				}, 150);

				selectedArea.style.setProperty('--selected-texture', `url(${newIcon})`);
				dropdown.classList.remove('color-select__dropdown-open');
				selectedArea.classList.remove('color-select__selected-open');
			});
		});
	}
};

function renderProductData(product) {
	// Название
	const titleLink = document.getElementById('prod-title');
	if (titleLink) {
		const icon = titleLink.querySelector('img');
		titleLink.innerHTML = '';
		titleLink.appendChild(icon);
		titleLink.append(` ${product.title}`);
	}

	// Описание и материалы
	const setContent = (id, content) => {
		const el = document.getElementById(id);
		if (el) el.textContent = content;
	};

	setContent('prod-description', product.fullDescription);
	setContent('prod-materials', product.materials);

	// Параметры
	const paramsList = document.getElementById('prod-params');
	if (paramsList && product.params) {
		paramsList.innerHTML = product.params
			.map(
				(p) => `
                <li class="params-list__item">
                    <span>${p.name}</span> 
                    <span>${p.value}</span>
                </li>
            `
			)
			.join('');
	}

	// ====================== ГАЛЕРЕЯ ======================
	const gallery = document.getElementById('prod-gallery');
	if (gallery && product.gallery) {
		gallery.innerHTML = product.gallery
			.map((img, index) => {
				let className = 'gallery-grid__item';
				if (img.isWide) className += ' gallery-grid__item-wide';
				if (index === 0) className += ' gallery-grid__item-main';

				const isFirst = index === 0;

				return `
                    <div class="${className}">
                        <img src="${img.src}" alt="${product.title}">
                        ${
													isFirst
														? `
                        <section class="order-badge">
                            <a class="order-badge__link" href="#">
                                <div class="order-badge__card">
                                    <div class="order-badge__substrate"></div>
                                    <div class="order-badge__img-box">
                                        <img id="prod-badge-img" alt="${product.title}" src="${product.image}">
                                    </div>
                                    <div class="order-badge__info">
                                        <div>
                                            <h3>Купить</h3>
                                        </div>
                                        <div class="order-badge__label" id="prod-price"></div>
                                    </div>
                                </div>
                            </a>
                        </section>`
														: ''
												}
                    </div>
                `;
			})
			.join('');
	}

	// Устанавливаем цену и картинку бейджа ТОЛЬКО ПОСЛЕ создания галереи!

	const priceEl = document.getElementById('prod-price');
	if (priceEl) {
		priceEl.textContent = `${product.price.toLocaleString()}`;
	}

	const badgeImg = document.getElementById('prod-badge-img');
	if (badgeImg) {
		badgeImg.src = product.image;
	}
}

// страница 404
function redirectTo404() {
	window.location.replace('/404.html');
}
