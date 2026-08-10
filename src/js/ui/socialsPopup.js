export function initSocialsPopup(lenis) {
	const popup = document.querySelector('.form-socials');
	const overlay = document.getElementById('socials-overlay');
	const closeBtn = document.getElementById('close-socials');
	const closeBtnBottom = document.querySelector('.form-socials__btn-form');

	if (!popup) return;

	function open() {
		popup.classList.add('active');

		// Компенсация скроллбара
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;

		// Блокируем скролл НА HTML и BODY
		document.documentElement.classList.add('socials-open');
		document.body.classList.add('socials-open');
		document.documentElement.style.paddingRight = `${scrollbarWidth}px`;

		if (lenis) lenis.stop();
	}

	function close() {
		popup.classList.remove('active');

		// Разблокируем скролл
		document.documentElement.classList.remove('socials-open');
		document.body.classList.remove('socials-open');
		document.documentElement.style.paddingRight = ''; // Убираем компенсацию

		if (lenis) lenis.start();
	}

	// Открытие
	document.addEventListener('click', (e) => {
		const trigger = e.target.closest('[data-action="open-socials"]');
		if (trigger) {
			e.preventDefault();
			open();
		}
	});

	// Закрытия
	closeBtn?.addEventListener('click', close);
	closeBtnBottom?.addEventListener('click', close);
	overlay?.addEventListener('click', close);

	popup.addEventListener('click', (e) => {
		if (e.target === popup) close();
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && popup.classList.contains('active')) {
			close();
		}
	});
}
