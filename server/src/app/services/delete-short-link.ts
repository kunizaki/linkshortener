import {eq} from "drizzle-orm";
import {NotFoundLink} from "@/app/services/errors/not-found-link";
import {db} from "@/infra/db";
import {shortLinks} from "@/infra/db/schemas/database";
import {makeLeft, makeRight} from "@/infra/shared/either";

export async function deleteShortLink({ id }: { id: string }) {
	try {
		const result = await db
			.delete(shortLinks)
			.where(eq(shortLinks.id, id))
			.returning();

		if (result.length === 0) {
			return makeLeft(new NotFoundLink());
		}

		return makeRight({ result });
	} catch (error) {
		return makeLeft(error);
	}
}
