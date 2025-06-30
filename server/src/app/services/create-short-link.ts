import {eq} from "drizzle-orm";
import {z} from "zod";
import {DuplicateShortLink} from "@/app/services/errors/duplicate-short-link";
import {db} from "@/infra/db";
import {shortLinks} from "@/infra/db/schemas/database";
import {makeLeft, makeRight} from "@/infra/shared/either";

const createShortLinkInput = z.object({
	shortId: z.string(),
	original: z.string(),
});

type CreateShortLinkInput = z.infer<typeof createShortLinkInput>;

export async function createShortLink(input: CreateShortLinkInput) {
	try {
		const { shortId, original } = createShortLinkInput.parse(input);

		const findDuplicate = await db.query.shortLinks.findFirst({
			where: eq(shortLinks.shortId, shortId),
		});

		if (findDuplicate) {
			return makeLeft(new DuplicateShortLink());
		}

		const [shortUrlInfos] = await db
			.insert(shortLinks)
			.values({
				shortId,
				original,
			})
			.returning();

		return makeRight(shortUrlInfos);
	} catch (error) {
		return makeLeft(error);
	}
}
