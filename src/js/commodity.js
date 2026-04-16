// async function initProductPage() {
// 	// 1. Извлекаем slug из URL
// 	const urlParams = new URLSearchParams(window.location.search);
// 	const productSlug = urlParams.get('slug');

// 	if (!productSlug) {
// 		window.location.href = '/catalog.html';
// 		return;
// 	}

// 	try {
// 		// 2. Загружаем JSON
// 		const response = await fetch('/src/data/products.json');
// 		const products = await response.json();

// 		// 3. Ищем товар с таким же slug
// 		const product = products.find((p) => p.slug === productSlug);

// 		if (!product) {
// 			console.error('Товар не найден');
// 			return;
// 		}

// 		// 4. Отрисовываем данные на странице
// 		renderProductData(product);
// 	} catch (error) {
// 		console.error('Ошибка загрузки БД:', error);
// 	}
// }

// function renderProductData(product) {
// 	// Название (вставляем текст после иконки-стрелки)
// 	const titleLink = document.getElementById('prod-title');
// 	titleLink.childNodes[2].textContent = product.title;

// 	// Описание и материалы
// 	document.getElementById('prod-description').textContent =
// 		product.fullDescription;
// 	document.getElementById('prod-materials').textContent = product.materials;

// 	// Цена и картинка в бадже
// 	document.getElementById(
// 		'prod-price'
// 	).textContent = `${product.price.toLocaleString()} ₽`;
// 	document.getElementById('prod-badge-img').src = product.image;

// 	// Параметры (генерируем список li)
// 	const paramsContainer = document.getElementById('prod-params');
// 	paramsContainer.innerHTML = product.params
// 		.map(
// 			(param) => `
//         <li class="params-list__item">
//             <span>${param.name}</span> 
//             <span>${param.value}</span>
//         </li>
//     `
// 		)
// 		.join('');

// 	// Галерея (с учетом твоих классов isWide)
// 	const galleryContainer = document.getElementById('prod-gallery');
// 	galleryContainer.innerHTML = product.gallery
// 		.map((item, index) => {
// 			let classes = 'gallery-grid__item';
// 			if (item.isWide) classes += ' gallery-grid__item-wide';
// 			if (index === 0) classes += ' gallery-grid__item-main'; // первое фото обычно главное

// 			return `
//             <div class="${classes}">
//                 <img src="${item.src}" alt="${product.title}">
//             </div>
//         `;
// 		})
// 		.join('');
// }

// // Запускаем при загрузке страницы
// document.addEventListener('DOMContentLoaded', initProductPage);
