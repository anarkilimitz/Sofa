import gsap from 'gsap';

export function initConditionsSlider() {
	const slider = document.querySelector('.conditions__slider');
	if (!slider) return;

	const wrapper = slider.querySelector('.conditions__wrapper');
	const track = slider.querySelector('.conditions__track');
	const slides = Array.from(track.querySelectorAll('.conditions__column'));
	const prevBtn = slider.querySelector('.conditions__arrow--prev');
	const nextBtn = slider.querySelector('.conditions__arrow--next');

	if (!slides.length) return;

	const GAP = 20;
	const VISIBLE = 3.7;

	let containerW, slideW, maxOffset, currentPos;
	let isDragging = false;
	let startX, startPos;

	function isDesktop() {
		return window.innerWidth > 1200;
	}

	function calc() {
		containerW = wrapper.offsetWidth;
		slideW = (containerW - GAP * (VISIBLE - 1)) / VISIBLE;
		maxOffset = slides.length * slideW + (slides.length - 1) * GAP - containerW;
		if (maxOffset < 0) maxOffset = 0;
	}

	function applySizes() {
		slides.forEach((s) => {
			s.style.width = slideW + 'px';
			s.style.minWidth = slideW + 'px';
			s.style.flexShrink = '0';
		});
	}

	function moveTo(pos, animate = true) {
		pos = Math.round(Math.max(-maxOffset, Math.min(0, pos)));
		currentPos = pos;

		if (animate) {
			gsap.to(track, { x: pos, duration: 0.6, ease: 'power2.out' });
		} else {
			gsap.set(track, { x: pos });
		}

		updateArrows();
	}

	function updateArrows() {
		if (prevBtn) {
			prevBtn.classList.toggle('disabled', Math.abs(currentPos) < 2);
		}
		if (nextBtn) {
			nextBtn.classList.toggle(
				'disabled',
				Math.abs(currentPos + maxOffset) < 2
			);
		}
	}

	/* --- Стрелки --- */
	if (prevBtn)
		prevBtn.addEventListener('click', () => moveTo(currentPos + slideW + GAP));
	if (nextBtn)
		nextBtn.addEventListener('click', () => moveTo(currentPos - slideW - GAP));

	/* --- Drag (мышь + тач) --- */
	function getX(e) {
		return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
	}

	function onDown(e) {
		if (!isDesktop()) return;
		isDragging = true;
		startX = getX(e);
		startPos = currentPos;
		gsap.killTweensOf(track);
		track.classList.add('dragging');
	}

	function onMove(e) {
		if (!isDragging) return;
		e.preventDefault();
		const diff = getX(e) - startX;
		moveTo(startPos + diff, false);
	}

	function onUp() {
		if (!isDragging) return;
		isDragging = false;
		track.classList.remove('dragging');

		// Snap к ближайшему слайду
		const step = slideW + GAP;
		const nearest = Math.round(currentPos / step) * step;
		moveTo(nearest);
	}

	track.addEventListener('mousedown', onDown);
	track.addEventListener('touchstart', onDown, { passive: true });
	window.addEventListener('mousemove', onMove);
	window.addEventListener('touchmove', onMove, { passive: false });
	window.addEventListener('mouseup', onUp);
	window.addEventListener('touchend', onUp);
	track.addEventListener('dragstart', (e) => e.preventDefault());

	/* --- Resize --- */
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			if (!isDesktop()) return;
			calc();
			applySizes();
			moveTo(currentPos, false);
		}, 150);
	});

	/* --- Инициализация --- */
	if (isDesktop()) {
		calc();
		applySizes();
		currentPos = 0;
		gsap.set(track, { x: 0 });
		updateArrows();
	}
}
