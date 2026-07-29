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

	function getGap() {
		return window.innerWidth > 768 ? 20 : 10;
	}

	function getVisibleCount() {
		return window.innerWidth > 768 ? 3.7 : 1.25;
	}

	function getSidePadding() {
		if (window.innerWidth > 768) {
			return { left: 0, right: 120 }; // 120px справа на десктопе
		} else {
			return { left: 0, right: 20 }; // на мобиле
		}
	}

	let GAP = getGap();
	let VISIBLE = getVisibleCount();
	let PADDING = getSidePadding();

	let containerW,
		slideW,
		maxOffset,
		currentPos = 0;
	let isDragging = false;
	let isScrollingY = false;
	let startX = 0;
	let startY = 0;
	let startPos = 0;

	function calc() {
		GAP = getGap();
		VISIBLE = getVisibleCount();

		const PADDING = getSidePadding();

		containerW = wrapper.clientWidth;

		const availableW = containerW - PADDING.left;
		slideW = (availableW - GAP * (VISIBLE - 1)) / VISIBLE;

		const totalTrackWidth =
			slides.length * slideW +
			(slides.length - 1) * GAP +
			PADDING.left +
			PADDING.right;

		maxOffset = Math.max(0, totalTrackWidth - containerW);
	}

	function applySizes() {
		const PADDING = getSidePadding();

		slides.forEach((s) => {
			s.style.width = `${slideW}px`;
			s.style.minWidth = `${slideW}px`;
			s.style.flexShrink = '0';
		});

		track.style.paddingLeft = `${PADDING.left}px`;
		track.style.paddingRight = `${PADDING.right}px`;
	}

	function moveTo(pos, animate = true) {
		pos = Math.round(Math.max(-maxOffset, Math.min(0, pos)));
		currentPos = pos;

		if (animate) {
			gsap.to(track, { x: pos, duration: 0.5, ease: 'power2.out' });
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

			// Вешаем onerror сразу
			img.addEventListener('error', showSkeleton);

			if (img.complete) {
				if (img.naturalWidth === 0 || img.naturalHeight === 0) {
					showSkeleton();
				}
			}
		});
	}

	// ТАЧ И МЫШЬ
	function getCoords(e) {
		const touch = e.touches ? e.touches[0] : e;
		return { x: touch.clientX, y: touch.clientY };
	}

	function onDown(e) {
		isDragging = true;
		isScrollingY = false;
		const coords = getCoords(e);
		startX = coords.x;
		startY = coords.y;
		startPos = currentPos;

		gsap.killTweensOf(track);
		track.classList.add('dragging');
	}

	function onMove(e) {
		if (!isDragging) return;

		const coords = getCoords(e);
		const diffX = coords.x - startX;
		const diffY = coords.y - startY;

		if (
			!isScrollingY &&
			Math.abs(diffY) > Math.abs(diffX) &&
			Math.abs(diffY) > 5
		) {
			isScrollingY = true;
			isDragging = false;
			track.classList.remove('dragging');
			return;
		}

		if (isScrollingY) return;

		if (e.cancelable) e.preventDefault();
		moveTo(startPos + diffX, false);
	}

	function onUp() {
		if (!isDragging) return;
		isDragging = false;
		track.classList.remove('dragging');

		const step = slideW + GAP;
		const nearest = Math.round(currentPos / step) * step;
		moveTo(nearest);
	}

	/* Слушатели */
	track.addEventListener('mousedown', onDown);
	track.addEventListener('touchstart', onDown, { passive: true });

	window.addEventListener('mousemove', onMove);
	window.addEventListener('touchmove', onMove, { passive: false });

	window.addEventListener('mouseup', onUp);
	window.addEventListener('touchend', onUp);

	// Фикс подвисаний драга
	window.addEventListener('touchcancel', onUp);
	document.addEventListener('mouseleave', onUp);

	track.addEventListener('dragstart', (e) => e.preventDefault());

	/* Стрелки */
	if (prevBtn) {
		prevBtn.addEventListener('click', () =>
			moveTo(currentPos + (slideW + GAP))
		);
	}
	if (nextBtn) {
		nextBtn.addEventListener('click', () =>
			moveTo(currentPos - (slideW + GAP))
		);
	}

	/* Resize с безопасной перепривязкой позиции */
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			calc();
			applySizes();
			moveTo(currentPos, false); // Позиция плавно корректируется с учетом maxOffset
		}, 100);
	});

	/* Инициализация */
	calc();
	applySizes();
	currentPos = 0;
	gsap.set(track, { x: 0 });
	updateArrows();
	initSkeletons();
}
