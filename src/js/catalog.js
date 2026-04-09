export function render(productsList) {
	const container = document.querySelector('#catalog');
	const template = document.querySelector('#card-template');

	console.log(productsList);

	if (!container || !template) return;

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
