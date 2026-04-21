export function initCopyEmail() {
	const copyBtn = document.querySelector('.contacts__copy');
	const emailLink = document.getElementById('email-to-copy');

	if (!copyBtn || !emailLink) return;

	const email = emailLink.textContent.trim();

	copyBtn.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(email);

			// надпись Скопировано
			const copiedText = document.createElement('span');
			copiedText.className = 'copy-success';
			copiedText.textContent = 'Скопировано!';

			// Убираем предыдущую надпись, если есть
			const existing = copyBtn.querySelector('.copy-success');
			if (existing) existing.remove();

			// Добавляем новую
			copyBtn.appendChild(copiedText);

			// Плавное появление
			setTimeout(() => {
				copiedText.style.opacity = '1';
			}, 10);
			
			setTimeout(() => {
				copiedText.style.opacity = '0';
				
				setTimeout(() => {
					copiedText.remove();
				}, 300);
			}, 2000);
		} catch (err) {
			console.error('Не удалось скопировать:', err);
		}
	});
}
