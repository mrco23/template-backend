const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema } = require("./schema");

const UserValidator = {
	validateUserPayload: (payload) => {
		const validateResult = UserPayloadSchema(payload);

		if (validateResult.error) {
			throw new InvariantError(validateResult.error.message);
		}
	},
};

module.exports = UserValidator;
