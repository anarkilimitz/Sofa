export function initCopyEmail() {
	const copyBtn = document.querySelector('.contacts__copy');
	const emailLink = document.getElementById('email-to-copy');

	if (!copyBtn || !emailLink) return;

	const email = emailLink.textContent.trim();

	copyBtn.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(email);
			
			let copiedText = copyBtn.querySelector('.copy-success');

			if (!copiedText) {
				copiedText = document.createElement('span');
				copiedText.className = 'copy-success';
				copiedText.textContent = 'Скопировано!';
				copyBtn.appendChild(copiedText);
			}
			
			// микро-таймаут для срабатывания транзишена
			setTimeout(() => {
				copiedText.classList.add('is-visible');
			}, 10);
			
			setTimeout(() => {
				copiedText.classList.remove('is-visible');

				// Удаляем из DOM только после завершения анимации скрытия
				setTimeout(() => {
					if (!copiedText.classList.contains('is-visible')) {
						copiedText.remove();
					}
				}, 300);
			}, 2000);
		} catch (err) {
			console.error('Не удалось скопировать:', err);
		}
	});
}
