export class DuplicateShortLink extends Error {
	constructor() {
		super("Short link already exists.");
	}
}