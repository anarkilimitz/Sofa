export function initFooterNavigation(lenis) {
	if (!lenis) return;
	
	const scrollMap = {
		'#to-specifics': '#specifics',
		'#to-materials': '#materials',
		'#to-top': '#hero',
		'.sub-link a': '#specifics',
	};

	Object.entries(scrollMap).forEach(([trigger, target]) => {
		const element = document.querySelector(trigger);
		if (element) {
			element.addEventListener('click', (e) => {
				e.preventDefault(); // Важно для ссылки <a>

				lenis.scrollTo(target, {
					duration: 2,
					easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				});
			});
		}
	});
}
