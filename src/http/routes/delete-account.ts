import { db } from "@/db/connection";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

export const deleteAccount = new Elysia().delete(
	"/accounts/:id",
	async ({ set, params }) => {
		const { id } = params;

		await db.delete(accounts).where(eq(accounts.id, id));

		set.status = 204;
	},
	{
		params: z.object({
			id: z.string(),
		}),
	},
);
