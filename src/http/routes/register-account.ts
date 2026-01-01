import { db } from "@/db/connection";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { EmailAlreadyInUseError } from "@/http/errors/email-already-in-use-error";
import { UsernameAlreadyTakenError } from "@/http/errors/username-already-taken-error";

export const registerAccount = new Elysia()
	.error({
		EMAIL_ALREADY_IN_USE: EmailAlreadyInUseError,
		USERNAME_ALREADY_TAKEN: UsernameAlreadyTakenError,
	})
	.onError(({ code, error, status }) => {
		switch (code) {
			case "EMAIL_ALREADY_IN_USE":
				return status(409, error.message);
			case "USERNAME_ALREADY_TAKEN":
				return status(409, error.message);
		}
	})
	.post(
		"/accounts",
		async ({ body, set }) => {
			const { username, email, password } = body;

			const [isUsernameAlreadyTaken] = await db
				.select()
				.from(accounts)
				.where(eq(accounts.username, username));

			if (isUsernameAlreadyTaken) {
				throw new UsernameAlreadyTakenError();
			}

			const [isEmailAlreadyInUse] = await db
				.select()
				.from(accounts)
				.where(eq(accounts.email, email));

			if (isEmailAlreadyInUse) {
				throw new EmailAlreadyInUseError();
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await db.insert(accounts).values({
				username,
				email,
				password: hashedPassword,
			});

			set.status = 201;
		},
		{
			body: z.object({
				username: z.string(),
				email: z.email(),
				password: z.string().min(1).max(20),
			}),
		},
	);
