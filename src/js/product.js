import products from '../data/products.json';
import { handleMobileLayout } from './mobileLayout';

export const initProduct = () => {
	console.log('initProduct запущен');
	initAllAccordions();
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

// ====================== Аккордеон ======================
function initAllAccordions() {
	const accordionHeaders = document.querySelectorAll('.accordion__header');

	accordionHeaders.forEach((header) => {
		// Убираем старые обработчики, чтобы не дублировались при повторных вызовах
		header.removeEventListener('click', toggleAccordionItem);
		header.addEventListener('click', toggleAccordionItem);
	});
}

function toggleAccordionItem() {
	const accordionItem = this.parentElement;
	accordionItem.classList.toggle('accordion__item-active');
}

function renderProductData(product) {
	console.log('Рендерим товар:', product.title);
	// 1. Название
	const titleLink = document.getElementById('prod-title');
	if (titleLink) {
		const icon = titleLink.querySelector('img');
		titleLink.innerHTML = '';
		if (icon) titleLink.appendChild(icon);
		titleLink.append(` ${product.title}`);
	}

	// 2. Описание и материалы
	const setContent = (id, content) => {
		const el = document.getElementById(id);
		if (el) el.textContent = content || '';
	};
	setContent('prod-description', product.fullDescription);
	setContent('prod-materials', product.materials);

	// 3. Параметры
	const paramsList = document.getElementById('prod-params');
	if (paramsList && product.params) {
		paramsList.innerHTML = product.params
			.map(
				(p) =>
					`<li class="params-list__item"><span>${p.name}</span> <span>${p.value}</span></li>`
			)
			.join('');
	}

	// 4. Галерея и Бейдж
	const gallery = document.getElementById('prod-gallery');
	if (gallery && product.gallery) {
		gallery.innerHTML = ''; // Очищаем контейнер

		product.gallery.forEach((imgData, index) => {
			const item = document.createElement('div');
			let className = 'gallery-grid__item';
			if (imgData.isWide) className += ' gallery-grid__item-wide';
			if (index === 0) className += ' gallery-grid__item-main';
			item.className = className;

			const img = document.createElement('img');

			img.onload = () => {};

			// если картинка ОТСУТСТВУЕТ (ошибка 404)
			img.onerror = () => {
				// Прячем стандартную иконку "битой картинки"
				img.style.display = 'none';

				// Включаем скелетон
				item.classList.add('is-loading');

				const skeletonEl = document.createElement('div');
				skeletonEl.className = 'skeleton';
				skeletonEl.innerHTML = `
                    <div class="skeleton__header">
                        <div class="skeleton__circle"></div>
                        <div class="skeleton__mini">Временно битая ссылка</div>
                    </div>
                    <div class="skeleton__block">ТУТ БУДЕТ КРАСИВЫЙ СКЕЛЕТОН</div>
                    <div class="skeleton__block"></div>
                    <div class="skeleton__block"></div>
                `;

				// Вставляем скелетон в карточку
				item.appendChild(skeletonEl);
			};

			img.src = imgData.src;
			img.alt = product.title;
			item.appendChild(img);

			// Если это первая картинка — добавляем бейдж из шаблона
			if (index === 0) {
				const template = document.getElementById('order-badge-template');
				if (template) {
					const badge = template.content.cloneNode(true);

					const badgeImg = badge.querySelector('.badge-img');
					if (badgeImg) {
						badgeImg.src = product.image;
						badgeImg.alt = product.title;
					}

					const badgeLabel = badge.querySelector('.order-badge__label');
					if (badgeLabel) {
						badgeLabel.textContent = product.price.toLocaleString();
					}

					item.appendChild(badge);
				}
			}

			gallery.appendChild(item);
		});
	}
	if (typeof handleMobileLayout === 'function') {
		handleMobileLayout();
	}
}

// страница 404
function redirectTo404() {
	window.location.replace('/page404.html');
}
