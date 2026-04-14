export const initProduct = () => {
	// 1. Логика Аккордеона
	const accordionHeaders = document.querySelectorAll('.accordion__header');

	accordionHeaders.forEach((header) => {
		header.addEventListener('click', () => {
			const item = header.parentElement;
			item.classList.toggle('accordion__item-active');
		});
	});

	// 2. Логика выбора цвета
	const colorPicker = document.getElementById('colorPicker');
	const selectedArea = colorPicker.querySelector('.color-select__selected');
	const dropdown = colorPicker.querySelector('.color-select__dropdown');
	const options = colorPicker.querySelectorAll('.color-select__option');

	// Открытие/закрытие
	selectedArea.addEventListener('click', () => {
		dropdown.classList.toggle('color-select__dropdown-open');
		selectedArea.classList.toggle('color-select__selected-open');
	});

	// Выбор опции
	options.forEach((option) => {
		option.addEventListener('click', () => {
			const nameEl = selectedArea.querySelector('.color-select__name');
			const newName = option.dataset.name;
			const newIcon = option.dataset.icon;

			// анимация текста
			nameEl.style.opacity = '0';
			nameEl.style.transform = 'translateX(15px)';

			setTimeout(() => {
				nameEl.textContent = newName;
				nameEl.style.opacity = '1';
				nameEl.style.transform = 'translateX(0)';
			}, 150);

			// Меняем только фон (текстуру)
			selectedArea.style.setProperty('--selected-texture', `url(${newIcon})`);

			// Небольшая задержка перед закрытием, чтобы анимация высоты началась после смены фона
			setTimeout(() => {
				dropdown.classList.remove('color-select__dropdown-open');
				selectedArea.classList.remove('color-select__selected-open');
			}, 50);
		});
	});

	// Закрытие при клике вне селекта
	window.addEventListener('click', (e) => {
		if (!colorPicker.contains(e.target)) {
			dropdown.classList.remove('color-select__dropdown-open');
			selectedArea.classList.remove('color-select__selected-open');
		}
	});
};
