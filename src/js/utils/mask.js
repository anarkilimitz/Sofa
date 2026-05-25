import IMask from 'imask';

export function initPhoneMask() {
	const elements = document.querySelectorAll('input[name="phone"]');

	const maskOptions = {
		mask: '+{7} (000) 000-00-00',
		lazy: true,
		placeholderChar: '_',
		prepare: function (str, masked) {
			if (str === '8' && masked.value === '') {
				return '7';
			}
			return str;
		},
	};

	elements.forEach((el) => {
		const mask = IMask(el, maskOptions);

		el.addEventListener('focus', () => {
			if (!el.value) {
				mask.value = '+7';
			}
		});

		el.addEventListener('blur', () => {
			if (mask.unmaskedValue === '7' || mask.unmaskedValue === '') {
				mask.value = '';
			}
		});
		mask.on('accept', () => {
			el.dispatchEvent(new Event('input', { bubbles: true }));
		});
	});
}
