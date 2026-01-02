export class UnauthorizedError extends Error {
	constructor() {
		super("Invalid email or password");
		this.name = "UnauthorizedError";
	}
}
