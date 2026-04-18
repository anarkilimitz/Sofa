export function initHeroVideo() {
	const video = document.getElementById('hero-video');
	if (!video) return;

	const loadVideo = () => {
		const webm = document.createElement('source');
		webm.src = '/public/video/bg-main.webm';
		webm.type = 'video/webm';

		const mp4 = document.createElement('source');
		mp4.src = '/public/video/bg-main.mp4';
		mp4.type = 'video/mp4';

		video.appendChild(webm);
		video.appendChild(mp4);

		video.load();

		video.play().catch(() => {});
	};

	// Intersection Observer
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting) {
				loadVideo();
				observer.disconnect();
			}
		},
		{
			rootMargin: '200px', // подгрузка чуть заранее
		}
	);

	observer.observe(video);
}
