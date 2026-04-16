import { showLoader } from './ui/loader.js';

export async function render(productsList, { withLoader = false } = {}) {
	const container = document.querySelector('#catalog');
	const template = document.querySelector('#card-template');

	if (!container || !template) return;

	// loader только при первом запуске
	if (withLoader) {
		showLoader(container);

		const minDelay = new Promise((r) => setTimeout(r, 700));

		const imagesPromises = productsList.map((product) => {
			return new Promise((resolve) => {
				const img = new Image();
				img.src = product.image;
				img.onload = resolve;
				img.onerror = resolve;
			});
		});

		await Promise.all([Promise.all(imagesPromises), minDelay]);
	}

	container.innerHTML = '';

	productsList.forEach((product) => {
		const node = template.content.cloneNode(true);

		const card = node.querySelector('.catalog__card');
		const img = node.querySelector('img');
		const title = node.querySelector('.catalog__card-title');
		const desc = node.querySelector('.catalog__desc');
		const price = node.querySelector('.catalog__price');

		if (product.isWide) {
			card.classList.add('catalog__card-wide');
		}

		card.href = `/product.html?slug=${product.slug}`;

		img.src = product.image;
		img.alt = product.title;

		title.textContent = product.title;
		desc.textContent = product.description;
		price.textContent = `₽${product.price.toLocaleString()}`;

		container.appendChild(node);
	});
}
