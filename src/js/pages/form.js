import { FormValidator } from '../utils/validator';

export function initForm() {
	const formModal = document.querySelector('.container-form');
	const closeBtn = document.querySelector('.close-form');

	// --- scroll lock ---
	function lockScroll() {
		document.body.style.overflow = 'hidden';
	}

	function unlockScroll() {
		document.body.style.overflow = '';
	}

	// --- открытие ---
	document.addEventListener('click', (e) => {
		const openBtn = e.target.closest('[data-action="open-form"]');

		if (openBtn) {
			e.preventDefault(); // ОТМЕНА ПЕРЕХОДА ПО ССЫЛКЕ (чтобы не прыгало вверх)
			formModal.classList.add('active');
			lockScroll();
		}
	});

	// --- закрытие (ЕДИНАЯ функция) ---
	function closeModal() {
		formModal.classList.remove('active');
		unlockScroll();
	}

	// кнопка закрытия
	closeBtn?.addEventListener('click', closeModal);

	// клик вне формы
	formModal.addEventListener('click', (e) => {
		if (e.target === formModal) closeModal();
	});

	// ESC
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && formModal.classList.contains('active')) {
			closeModal();
		}
	});

	const form = document.querySelector('#contactForm');
	if (!form) return;

	const btn = form.querySelector('button[type="submit"]');
	if (!btn) return;

	const btnTextEl = btn.querySelector('.btn-text');
	const defaultBtnText = btnTextEl ? btnTextEl.textContent : btn.textContent;

	// валидация
	const validator = new FormValidator(form, {
		firstName: [
			{
				validator: (v) => /^[a-zA-Zа-яА-ЯёЁ-]+$/.test(v),
				message: 'Только буквы без пробелов',
			},
			{
				validator: (v) => v.length >= 2,
				message: 'Минимум 2 символа',
			},
		],

		phone: [
			{
				validator: (v) => {
					const onlyDigits = v.replace(/\D/g, '');
					return onlyDigits.length >= 11;
				},
				message: 'Введите корректный номер',
			},
		],

		email: [
			{
				validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
				message: 'Неверный email',
			},
		],

		message: [
			{
				validator: (v) => v.length >= 10,
				message: 'Минимум 10 символов',
			},
		],

		agree: [
			{
				validator: (v) => v === true,
				message: 'Необходимо согласие',
			},
		],
	});

	// отправка формы
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		if (!validator.validateForm()) return;

		// Визуальное состояние загрузки
		btn.classList.add('loading');
		btn.disabled = true;
		const oldText = btnTextEl.textContent;
		btnTextEl.textContent = 'Отправка...';

		// Сбор данных формы
		const formData = new FormData(form);

		try {
			// Отправка на сервер (файл mail.php)
			const response = await fetch('mail.php', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (response.ok && result.status === 'success') {
				btnTextEl.textContent = 'Отправлено!';
				// Можно добавить класс success для визуализации
				form.reset();
				validator.reset();

				// Вернуть кнопку в исходное состояние через 3 сек
				setTimeout(() => {
					btn.classList.remove('loading');
					btn.disabled = false;
					btnTextEl.textContent = defaultBtnText;
				}, 3000);
			} else {
				// ОШИБКА СЕРВЕРА
				throw new Error(result.message || 'Ошибка сервера');
			}
		} catch (error) {
			console.error(error);
			btnTextEl.textContent = 'Ошибка!';
			btn.style.backgroundColor = '#ff4d4d';

			setTimeout(() => {
				btn.classList.remove('loading');
				btn.disabled = false;
				btn.style.backgroundColor = ''; // Вернуть цвет
				btnTextEl.textContent = defaultBtnText;
			}, 2000);
		}
	});
}
