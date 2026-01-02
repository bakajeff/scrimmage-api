import { Elysia } from "elysia";
import { registerAccount } from "@/http/routes/register-account";
import { env } from "@/env";
import { updateAccount } from "./http/routes/update-account";

const app = new Elysia()
	.use(registerAccount)
	.use(updateAccount)
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
