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
	renderProductInfo(product);
	renderColorOptions(product);

	setSelectedVariant(product, product.variants[0]);

	initColorPicker(product);
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

function renderProductInfo(product) {
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
}

function renderGallery(product, variant) {
	const gallery = document.getElementById('prod-gallery');
	if (gallery && variant.gallery) {
		// Очищаем и саму галерею, и удаляем из DOM любые старые элементы галереи,
		// которые могли остаться под аккордеонами с прошлого раза
		document
			.querySelectorAll('.gallery-grid__item')
			.forEach((item) => item.remove());

		gallery.innerHTML = '';

		variant.gallery.forEach((imgData, index) => {
			const item = document.createElement('div');
			let className = 'gallery-grid__item';
			if (imgData.isWide) className += ' gallery-grid__item-wide';
			if (index === 0) className += ' gallery-grid__item-main';
			item.className = className;

			const img = document.createElement('img');

			img.onerror = () => {
				img.style.display = 'none';
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
				item.appendChild(skeletonEl);
			};

			img.src = imgData.src;
			img.alt = product.title;
			item.appendChild(img);

			if (index === 0) {
				const template = document.getElementById('order-badge-template');
				if (template) {
					const badge = template.content.cloneNode(true);
					const badgeImg = badge.querySelector('.badge-img');
					if (badgeImg) {
						badgeImg.src = variant.catalogImage;
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

		handleMobileLayout();
	}
}

function renderColorOptions(product) {
	const dropdown = document.querySelector('.color-select__dropdown');

	if (!dropdown) return;

	dropdown.innerHTML = '';

	const title = document.createElement('h3');
	title.className = 'product__title-color';
	title.textContent = 'Ткани и цвета';

	dropdown.appendChild(title);

	product.variants.forEach((variant) => {
		const option = document.createElement('div');

		option.className = 'color-select__option';

		option.dataset.variant = variant.id;

		option.innerHTML = `
            <span>${variant.name}</span>

            <div
                class="color-select__swatch"
                style="background-image:url('${variant.texture}')">
            </div>
        `;

		dropdown.appendChild(option);
	});
}
// --- ИНТЕРАКТИВ ---

function initColorPicker(product) {
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
				const variantId = option.dataset.variant;

				const selectedVariant = product.variants.find(
					(variant) => variant.id === variantId
				);

				if (selectedVariant) {
					setSelectedVariant(product, selectedVariant);
				}
				dropdown.classList.remove('color-select__dropdown-open');
				selectedArea.classList.remove('color-select__selected-open');
			});
		});
	}
}

// функция выбора варианта
function setSelectedVariant(product, variant) {
	const selectedArea = document.querySelector('.color-select__selected');
	if (!selectedArea) return;

	const nameEl = selectedArea.querySelector('.color-select__name');

	nameEl.textContent = variant.name;

	selectedArea.style.setProperty(
		'--selected-texture',
		`url(${variant.texture})`
	);

	renderGallery(product, variant);
}

// страница 404
function redirectTo404() {
	window.location.replace('/page404.html');
}
