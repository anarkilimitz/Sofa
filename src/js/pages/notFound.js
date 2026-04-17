import gsap from 'gsap';

export const initNotFoundPage = () => {
	const bsod = document.querySelector('.bsod');
	const sadFace = document.querySelector('.sad-face');
	const returnBtn = document.querySelector('.return-btn');

	if (!bsod) return;

	// Анимация смайлика
	if (sadFace) {
		gsap.fromTo(
			sadFace,
			{ scale: 0.5, rotation: -20, opacity: 0 },
			{
				scale: 1,
				rotation: 0,
				opacity: 1,
				duration: 1.3,
				ease: 'elastic.out(1, 0.5)',
			}
		);
	}

	// Эффект мерцания BSOD
	let count = 0;
	const interval = setInterval(() => {
		if (count++ > 7) {
			clearInterval(interval);
			return;
		}
		bsod.style.opacity = Math.random() > 0.93 ? '0.96' : '1';
		setTimeout(() => (bsod.style.opacity = '1'), 100);
	}, 250);

	// Кнопка возврата
	if (returnBtn) {
		returnBtn.addEventListener('click', (e) => {
			e.preventDefault();
			gsap.to(bsod, {
				opacity: 0,
				y: -50,
				duration: 0.7,
				onComplete: () => {
					window.location.href =
						returnBtn.getAttribute('href') || '/catalog.html';
				},
			});
		});
	}
};
