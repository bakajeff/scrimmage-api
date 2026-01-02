import { Elysia } from "elysia";
import { authentication } from "../authentication";
import { db } from "@/db/connection";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProfile = new Elysia()
	.use(authentication)
	.get("/me", async ({ getCurrentUser }) => {
		const { sub: accountId } = await getCurrentUser();
		const [account] = await db
			.select()
			.from(accounts)
			.where(eq(accounts.id, accountId));

		if (!account) {
			throw new Error("Account not found");
		}

		return account;
	});
