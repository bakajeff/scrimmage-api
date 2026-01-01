export class EmailAlreadyInUseError extends Error {
	constructor() {
		super("The given email is already in use.");
		this.name = "EmailAlreadyInUseError";
	}
}
