export class UsernameAlreadyTakenError extends Error {
	constructor() {
		super("The given username is already taken.");
		this.name = "UsernameAlreadyTakenError";
	}
}
