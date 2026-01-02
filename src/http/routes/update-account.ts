import { db } from "@/db/connection";
import { accounts } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { Elysia, NotFoundError } from "elysia";
import { z } from "zod";
import { EmailAlreadyInUseError } from "@/http/errors/email-already-in-use-error";
import { UsernameAlreadyTakenError } from "@/http/errors/username-already-taken-error";

export const updateAccount = new Elysia()
	.error({
		EMAIL_ALREADY_IN_USE: EmailAlreadyInUseError,
		USERNAME_ALREADY_TAKEN: UsernameAlreadyTakenError,
	})
	.onError(({ code, error, set }) => {
		switch (code) {
			case "EMAIL_ALREADY_IN_USE":
				set.status = 409;
				return { code, message: error.message };
			case "USERNAME_ALREADY_TAKEN":
				set.status = 409;
				return { code, message: error.message };
		}
	})
	.put(
		"/accounts/:id",
		async ({ body, params, set }) => {
			const { id } = params;
			const { username, email, bio, pictureUrl } = body;

			const [account] = await db
				.select()
				.from(accounts)
				.where(eq(accounts.id, id));

			if (!account) {
				throw new NotFoundError();
			}

			if (username && username !== account.username) {
				const [isUsernameAlreadyTaken] = await db
					.select()
					.from(accounts)
					.where(and(eq(accounts.username, username), ne(accounts.id, id)));

				if (isUsernameAlreadyTaken) {
					throw new UsernameAlreadyTakenError();
				}
			}

			if (email && email !== account.email) {
				const [isEmailAlreadyInUse] = await db
					.select()
					.from(accounts)
					.where(and(eq(accounts.email, email), ne(accounts.id, id)));

				if (isEmailAlreadyInUse) {
					throw new EmailAlreadyInUseError();
				}
			}

			await db
				.update(accounts)
				.set({
					username,
					email,
					bio,
					pictureUrl,
				})
				.where(eq(accounts.id, id));

			set.status = 204;
		},
		{
			body: z.object({
				username: z.string().optional(),
				email: z.email().optional(),
				bio: z.string().optional(),
				pictureUrl: z.url().optional(),
			}),
			params: z.object({
				id: z.string(),
			}),
		},
	);
