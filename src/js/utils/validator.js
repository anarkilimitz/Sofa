export class FormValidator {
	constructor(form, rules) {
		this.form = form;
		this.rules = rules;
		this.fields = [...form.querySelectorAll('[name]')];
		this.init();
	}

	init() {
		this.fields.forEach((field) => {
			const event = field.type === 'checkbox' ? 'change' : 'input';

			field.addEventListener(event, () => {
				this.validateField(field);
			});
		});
	}

	validateField(field) {
		const rules = this.rules[field.name];

		if (!rules) return true;

		for (const rule of rules) {
			const value =
				field.type === 'checkbox' ? field.checked : field.value.trim();

			if (!rule.validator(value)) {
				this.showError(field, rule.message);

				return false;
			}
		}

		this.clearError(field);

		return true;
	}

	getWrapper(field) {
		return field.closest('.field, .checkbox-field');
	}

	showError(field, message) {
		const wrapper = this.getWrapper(field);

		const error = wrapper?.querySelector('.error');

		if (error) error.textContent = message;

		field.classList.add('invalid');
		field.classList.remove('valid');
	}

	clearError(field) {
		const wrapper = this.getWrapper(field);

		const error = wrapper?.querySelector('.error');

		if (error) error.textContent = '';

		field.classList.remove('invalid');
		field.classList.add('valid');
	}

	validateForm() {
		return this.fields.map((f) => this.validateField(f)).every(Boolean);
	}

	reset() {
		this.fields.forEach((field) => {
			field.classList.remove('valid', 'invalid');

			const wrapper = this.getWrapper(field);
			const error = wrapper?.querySelector('.error');

			if (error) error.textContent = '';
		});
	}
}
