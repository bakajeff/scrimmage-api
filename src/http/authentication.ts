import { Elysia, type Static, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { env } from "@/env";

const payloadSchema = t.Object({
	sub: t.String(),
});

export const authentication = new Elysia()
	.error({
		UNAUTHORIZED: UnauthorizedError,
	})
	.onError(({ error, code, status }) => {
		switch (code) {
			case "UNAUTHORIZED":
				return status(401, error.message);
		}
	})
	.use(
		jwt({
			secret: env.JWT_SECRET,
			name: "jwt",
			schema: payloadSchema,
		}).derive({ as: "global" }, ({ jwt, cookie, cookie: { auth } }) => ({
			async signIn(payload: Static<typeof payloadSchema>) {
				auth.set({
					value: await jwt.sign(payload),
					httpOnly: true,
					path: "/",
					maxAge: 7 * 24 * 60 * 60,
				});
			},
			signOut() {
				auth.remove();

				delete cookie.auth;
			},
			async getCurrentUser() {
				const payload = await jwt.verify(auth.value as string);

				if (!payload) {
					throw new UnauthorizedError();
				}

				return payload;
			},
		})),
	);
