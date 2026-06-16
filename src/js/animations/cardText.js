import gsap from 'gsap';
import SplitType from 'split-type';

export const initCardTextAnimation = (lenis) => {
	const cards = document.querySelectorAll('.specifics-card');
	const isMobile = window.innerWidth <= 480;

	if (isMobile) {
		// ЛОГИКА МОБИЛЬНОГО ПОП-АПА
		const modal = document.getElementById('specifics-modal');
		const overlay = document.getElementById('specifics-modal-overlay');

		if (!modal) return;

		const closeBtn = modal.querySelector('.specifics-modal__close');
		const slides = modal.querySelectorAll('.specifics-modal__slide');
		const dots = modal.querySelectorAll('.dot');
		const paths = [
			'/public/img/specifics/specifics-sofa.jpg',
			'/public/img/specifics/specifics-ergonomic.jpg',
			'/public/img/specifics/specifics-ease.jpg',
		];

		// Функция переключения слайда
		const goToSlide = (index) => {
			slides.forEach((s) => s.classList.remove('active'));
			dots.forEach((d) => d.classList.remove('active'));

			const currentSlide = slides[index];
			currentSlide.classList.add('active');
			dots[index].classList.add('active');

			// Установка картинки
			const img = currentSlide.querySelector('.specifics-modal__image');
			if (img) {
				img.src = paths[index];
			}
		};

		const closeModal = () => {
			modal.classList.remove('is-active');
			if (overlay) overlay.classList.remove('is-active');
			document.body.classList.remove('no-scroll');

			if (lenis) lenis.start();
		};

		const openModal = (index) => {
			goToSlide(index);
			modal.classList.add('is-active');
			if (overlay) overlay.classList.add('is-active');
			document.body.classList.add('no-scroll');

			if (lenis) lenis.stop();
		};

		// Открытие модалки по клику на карточку
		cards.forEach((card, index) => {
			card.addEventListener('click', () => openModal(index));
		});

		// Переключение по точкам
		dots.forEach((dot) => {
			dot.addEventListener('click', (e) => {
				e.stopPropagation();
				const index = parseInt(dot.getAttribute('data-index'));
				goToSlide(index);
			});
		});

		// Закрытие
		if (closeBtn) closeBtn.addEventListener('click', closeModal);

		// Закрытие по клику на оверлей
		if (overlay) overlay.addEventListener('click', closeModal);

		// Закрытие по ESC
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && modal.classList.contains('is-active')) {
				closeModal();
			}
		});
	} else {
		// === ЛОГИКА ДЕСКТОПА (GSAP) ===
		cards.forEach((card) => {
			const textElement = card.querySelector('.specifics-card__text');
			if (!textElement) return;

			const splitText = new SplitType(textElement, {
				types: 'lines',
				lineClass: 'line-child',
			});

			splitText.lines.forEach((line) => {
				const wrapper = document.createElement('div');
				wrapper.classList.add('line-mask');
				line.parentNode.insertBefore(wrapper, line);
				wrapper.appendChild(line);
			});

			gsap.set(splitText.lines, { y: '105%' });

			card.addEventListener('mouseenter', () => {
				gsap.to(splitText.lines, {
					y: '0%',
					duration: 0.3,
					ease: 'power2.out',
					stagger: 0.05,
					overwrite: true,
				});
			});

			card.addEventListener('mouseleave', () => {
				gsap.to(splitText.lines, {
					y: '105%',
					duration: 0.2,
					ease: 'power2.in',
					overwrite: true,
				});
			});
		});
	}
};
