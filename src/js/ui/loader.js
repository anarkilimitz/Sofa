export function showLoader(container) {
	container.innerHTML = `
		<div class="loader-wrapper">
			<div class="loader"></div>
		</div>
	`;
}

export function hideLoader(container) {
	container.innerHTML = '';
}
