import gsap from 'gsap';

export function initConditionsPopup(lenis) {
	const overlay = document.getElementById('conditionsPopupOverlay');
	const popup = document.getElementById('conditionsPopup');
	const closeBtn = document.getElementById('conditionsPopupClose');
	const inner = popup ? popup.querySelector('.conditions-popup__inner') : null;
	const img = document.getElementById('conditionsPopupImg');
	const title = document.getElementById('conditionsPopupTitle');
	const text = document.getElementById('conditionsPopupText');
	const slides = document.querySelectorAll('.conditions__column');

	if (!overlay || !popup || !slides.length) return;

	let tl = null;
	let mouseDownPos = null;

	function open(slide) {
		const slideImg = slide.querySelector('.conditions__img img');
		const slideTitle = slide.querySelector('.conditions__column-title');
		const slideText = slide.querySelector('.conditions__text');

		img.src = slideImg ? slideImg.src : '';
		img.alt = slideImg ? slideImg.alt : '';
		title.textContent = slideTitle ? slideTitle.textContent : '';
		text.textContent = slideText ? slideText.textContent : '';

		overlay.classList.add('active');
		document.documentElement.classList.add('search-open');
		document.body.classList.add('search-open');

		if (lenis) lenis.stop();

		if (tl) tl.kill();
		gsap.set(popup, { y: '100%', opacity: 0 });
		popup.style.pointerEvents = 'auto';

		tl = gsap.to(popup, {
			y: '0%',
			opacity: 1,
			duration: 0.45,
			ease: 'power3.out',
		});
	}

	function close() {
		if (tl) tl.kill();

		popup.style.pointerEvents = 'none';

		tl = gsap.to(popup, {
			y: '100%',
			opacity: 0,
			duration: 0.35,
			ease: 'power2.in',
			onComplete() {
				overlay.classList.remove('active');
				document.documentElement.classList.remove('search-open');
				document.body.classList.remove('search-open');

				if (lenis) lenis.start();
			},
		});
	}

	slides.forEach((slide) => {
		slide.addEventListener('mousedown', (e) => {
			mouseDownPos = { x: e.clientX, y: e.clientY };
		});

		slide.addEventListener('click', (e) => {
			if (mouseDownPos) {
				const dx = e.clientX - mouseDownPos.x;
				const dy = e.clientY - mouseDownPos.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				mouseDownPos = null;

				if (dist > 5) return;
			}

			open(slide);
		});
	});

	if (closeBtn) {
		closeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			close();
		});
	}

	if (inner) {
		inner.addEventListener('click', (e) => e.stopPropagation());
	}

	popup.addEventListener('click', close);
	overlay.addEventListener('click', close);
}
