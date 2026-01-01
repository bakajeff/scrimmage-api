import { createId } from "@paralleldrive/cuid2";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	username: text().unique().notNull(),
	email: text().unique().notNull(),
	password: text().notNull(),
	pictureUrl: text(),
	bio: text(),
	isActive: boolean().default(true),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date()),
});
