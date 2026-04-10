export const initProduct = () => {
	// 1. Логика Аккордеона
	const accordionHeaders = document.querySelectorAll('.accordion__header');

	accordionHeaders.forEach((header) => {
		header.addEventListener('click', () => {
			const item = header.parentElement;
			item.classList.toggle('accordion__item--active');
		});
	});

	// 2. Логика выбора цвета
	const colorPicker = document.getElementById('colorPicker');
	const selectedArea = colorPicker.querySelector('.color-select__selected');
	const dropdown = colorPicker.querySelector('.color-select__dropdown');
	const options = colorPicker.querySelectorAll('.color-select__option');

	// Открытие/закрытие
	selectedArea.addEventListener('click', () => {
		dropdown.classList.toggle('color-select__dropdown--open');
	});

	// Выбор опции
	options.forEach((option) => {
		option.addEventListener('click', () => {
			const newColor = option.dataset.color;
			const newName = option.dataset.name;

			// Обновляем выбранное значение
			selectedArea.querySelector(
				'.color-select__swatch'
			).style.backgroundColor = newColor;
			selectedArea.querySelector('.color-select__name').textContent = newName;

			dropdown.classList.remove('color-select__dropdown--open');

			console.log(`Selected color: ${newName} (${newColor})`);
		});
	});

	// Закрытие при клике вне селекта
	window.addEventListener('click', (e) => {
		if (!colorPicker.contains(e.target)) {
			dropdown.classList.remove('color-select__dropdown--open');
		}
	});
};
