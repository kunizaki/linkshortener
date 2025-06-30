import {eq} from "drizzle-orm";
import {NotFoundLink} from "@/app/services/errors/not-found-link";
import {db} from "@/infra/db";
import {shortLinks} from "@/infra/db/schemas/database";
import {makeLeft, makeRight} from "@/infra/shared/either";

export async function getShortLink({ shortId }: { shortId: string }) {
	try {
		const shortLink = await db.query.shortLinks.findFirst({
			where: eq(shortLinks.shortId, shortId),
			with: {
				accesses: true,
			},
		});

		if (!shortLink) {
			return makeLeft(new NotFoundLink());
		}

		return makeRight(shortLink);
	} catch (error) {
		return makeLeft(error);
	}
}
