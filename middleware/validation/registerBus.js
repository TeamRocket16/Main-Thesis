const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateBusinessRegisterInput(data) {
	let errors = {};
	// Convert empty fields to an empty string so we can use validator functions
	data.BusinessName = !isEmpty(data.BusinessName) ? data.BusinessName : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.phone = !isEmpty(data.phone) ? data.phone : '';

	// Name checks
	if (Validator.isEmpty(data.BusinessName)) {
		errors.BusinessName = 'BusinessName field is required';
	}

	// Email checks
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	} else if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	// Password checks
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}

	if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
		errors.password = 'Password must be at least 8 characters';
	}

	if (!Validator.isLength(data.phone + '', { min: 7, max: 14 })) {
		errors.password = 'Phone must be at least 10 characters';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
