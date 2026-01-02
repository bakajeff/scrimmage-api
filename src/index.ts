import { Elysia } from "elysia";
import { registerAccount } from "@/http/routes/register-account";
import { env } from "@/env";
import { updateAccount } from "./http/routes/update-account";
import { deleteAccount } from "./http/routes/delete-account";
import { signIn } from "./http/routes/sign-in";
import { getProfile } from "./http/routes/get-profile";

const app = new Elysia()
	.use(registerAccount)
	.use(updateAccount)
	.use(deleteAccount)
	.use(signIn)
	.use(getProfile)
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
