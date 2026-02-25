import gsap from 'gsap';

export const initHeroScroll = () => {
	const heroTitle = document.querySelector('.hero-title');
	if (heroTitle) {
		gsap.to(heroTitle, {
			y: -50,
			opacity: 0,
			scrollTrigger: {
				trigger: '.hero-section',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});
	}
};
