const {
	PostAuthenticationPayloadSchema,
	PutAuthenticationPayloadSchema,
	DeleteAuthenticationPayloadSchema,
} = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const AuthenticationsValidator = {
	validatePostAuthenticationsPayload: (payload) => {
		const validationResult = PostAuthenticationPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	putAuthenticationPayloadSchema: (payload) => {
		const validationResult = PutAuthenticationPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
