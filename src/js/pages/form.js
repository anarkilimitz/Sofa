import { FormValidator } from '../utils/validator';

export function initForm() {
	const formModal = document.querySelector('.container-form');
	const closeBtn = document.querySelector('.close-form');

	const state1 = document.querySelector('.state-1');
	const state2 = document.querySelector('.state-2');
	const state3 = document.querySelector('.state-3');
	
	if (!formModal || !state1 || !state2 || !state3) return;

	// переключения состояний
	function switchState(showState) {
		[state1, state2, state3].forEach((s) => s.classList.remove('active'));
		showState.classList.add('active');
	}

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
			e.preventDefault();
			formModal.classList.add('active');
			switchState(state1); // Всегда открываем первую форму
			lockScroll();
		}
	});

	// --- закрытие (ЕДИНАЯ функция) ---
	function closeModal() {
		formModal.classList.remove('active');
		unlockScroll();
		if (form) form.reset();
		// При закрытии возвращаем кнопку в исходное состояние (на всякий случай)
		btn.classList.remove('loading');
		btn.disabled = false;
		btnTextEl.textContent = defaultBtnText;
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
			{ validator: (v) => v.length >= 2, message: 'Минимум 2 символа' },
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
			{ validator: (v) => v.length >= 10, message: 'Минимум 10 символов' },
		],
		agree: [{ validator: (v) => v === true, message: 'Необходимо согласие' }],
	});

	// отправка формы
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		if (!validator.validateForm()) return;

		// Визуальное состояние загрузки
		btn.classList.add('loading');
		btn.disabled = true;
		btnTextEl.textContent = 'Отправка...';

		const formData = new FormData(form);

		try {
			const response = await fetch('mail.php', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (response.ok && result.status === 'success') {
				// === НАЧАЛО ЛОГИКИ УСПЕХА ===
				
				switchState(state2);

				// Сбрасываем форму, пока пользователь смотрит на 2-й экран
				form.reset();
				validator.reset();

				// 3-е состояние ("Спасибо")
				setTimeout(() => {
					switchState(state3);
				}, 3000);

				// 3. Через еще 3 секунды (итого 6) закрываем модалку
				setTimeout(() => {
					closeModal();

					// Возвращаем кнопку в исходное состояние (уже после закрытия)
					btn.classList.remove('loading');
					btn.disabled = false;
					btnTextEl.textContent = defaultBtnText;
				}, 6000);
				
			} else {
				throw new Error(result.message || 'Ошибка сервера');
			}
		} catch (error) {
			console.error(error);
			btnTextEl.textContent = 'Ошибка!';
			btn.style.backgroundColor = '#ff4d4d';

			setTimeout(() => {
				btn.classList.remove('loading');
				btn.disabled = false;
				btn.style.backgroundColor = '';
				btnTextEl.textContent = defaultBtnText;
			}, 2000);
		}
	});
}
