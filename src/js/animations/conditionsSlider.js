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

	// Динамический GAP под разные экраны
	function getGap() {
		return window.innerWidth > 1000 ? 20 : 10;
	}

	function getVisibleCount() {
		return window.innerWidth > 1000 ? 3.7 : 1.3;
	}

	let GAP = getGap();
	let VISIBLE = getVisibleCount();

	let containerW, slideW, maxOffset, currentPos;
	let isDragging = false;
	let startX, startPos;

	function calc() {
		GAP = getGap();
		VISIBLE = getVisibleCount();
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

	// СКЕЛЕТОН
	function initSkeletons() {
		slides.forEach((slide) => {
			const imgWrap = slide.querySelector('.conditions__img');
			if (!imgWrap) return;

			const img = imgWrap.querySelector('img');
			if (!img) return;

			const showSkeleton = () => {
				img.style.display = 'none';
				imgWrap.classList.add('is-loading');

				if (imgWrap.querySelector('.skeleton')) return;

				const skeletonEl = document.createElement('div');
				skeletonEl.className = 'skeleton';
				skeletonEl.innerHTML = `
                    <div class="skeleton__header">
                        <div class="skeleton__circle"></div>
                        <div class="skeleton__mini">Временно битая ссылка</div>
                    </div>
                    <div class="skeleton__block">ТУТ БУДЕТ КРАСИВЫЙ СКЕЛЕТОН</div>
                    <div class="skeleton__block"></div>
                    <div class="skeleton__block"></div>
                `;
				imgWrap.appendChild(skeletonEl);
			};

			if (img.complete) {
				if (img.naturalWidth === 0 || img.naturalHeight === 0) {
					showSkeleton();
				}
			} else {
				img.onerror = showSkeleton;
			}
		});
	}

	/* --- Стрелки (циклический скролл) --- */
	function getStep() {
		return slideW + GAP;
	}

	function snapToNearest(pos) {
		const step = getStep();
		return Math.round(pos / step) * step;
	}

	if (prevBtn) {
		prevBtn.addEventListener('click', () => {
			const step = getStep();
			let newPos = currentPos + step;
			// if (newPos > 0) {
			// 	newPos = -maxOffset;
			// }
			moveTo(newPos);
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			const step = getStep();
			let newPos = currentPos - step;
			// if (Math.abs(newPos) > maxOffset + 2) {
			// 	newPos = 0;
			// }
			moveTo(newPos);
		});
	}

	/* --- Drag (мышь + тач) --- */
	function getX(e) {
		return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
	}

	function onDown(e) {
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

		const nearest = snapToNearest(currentPos);
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
			calc();
			applySizes();
			moveTo(currentPos, false);
		}, 150);
	});

	/* --- Инициализация --- */
	calc();
	applySizes();
	currentPos = 0;
	gsap.set(track, { x: 0 });
	updateArrows();
	initSkeletons();
}
