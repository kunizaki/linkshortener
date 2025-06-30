import {db} from "@/infra/db";
import {type Either, makeLeft, makeRight} from "@/infra/shared/either";

type ListShortLinks = {
	id: string;
	shortId: string;
	original: string;
	createdAt: Date;
	accesses: {
		id: string;
		shortLinkId: string;
		timestamp: Date;
		userAgent: string;
		ip: string;
	}[];
};

export async function listShortLinks(): Promise<
	Either<unknown, ListShortLinks[]>
> {
	try {
		const shortLinks = await db.query.shortLinks.findMany({
			with: {
				accesses: true,
			},
		});
		return makeRight(shortLinks);
	} catch (error) {
		return makeLeft(error);
	}
}
