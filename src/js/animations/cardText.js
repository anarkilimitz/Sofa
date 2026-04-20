import gsap from 'gsap';
import SplitType from 'split-type';

export const initCardTextAnimation = () => {
	const cards = document.querySelectorAll('.specifics-card');

	cards.forEach((card) => {
		const textElement = card.querySelector('.specifics-card__text');
		if (!textElement) return;

		// 1. Разбиваем текст на строки
		// split-type создаст div для каждой строки
		const splitText = new SplitType(textElement, {
			types: 'lines',
			lineClass: 'line-child',
		});

		// 2. Оборачиваем каждую строку во внешний div (маску)
		// Это нужно, чтобы строка выезжала "из ниоткуда"
		splitText.lines.forEach((line) => {
			const wrapper = document.createElement('div');
			wrapper.classList.add('line-mask');
			line.parentNode.insertBefore(wrapper, line);
			wrapper.appendChild(line);
		});

		// Подготавливаем начальное состояние строк
		gsap.set(splitText.lines, { y: '105%' });

		// 3. Анимация при наведении
		card.addEventListener('mouseenter', () => {
			gsap.to(splitText.lines, {
				y: '0%',
				duration: 0.3,
				ease: 'power2.out',
				stagger: 0.05, // задержка между строками
				overwrite: true,
			});
		});

		// 4. Сброс при уходе курсора
		card.addEventListener('mouseleave', () => {
			gsap.to(splitText.lines, {
				y: '105%',
				duration: 0.2,
				ease: 'power2.in',
				overwrite: true,
			});
		});
	});
};
