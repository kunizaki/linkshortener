import {z} from "zod";
import {db} from "@/infra/db";
import {accessLogs} from "@/infra/db/schemas/database";
import {makeLeft, makeRight} from "@/infra/shared/either";

const createLogInput = z.object({
	shortId: z.string(),
	ip: z.string(),
	userAgent: z.string(),
});

type CreateLogInput = z.infer<typeof createLogInput>;

export async function createLog(input: CreateLogInput) {
	try {
		const { shortId, ip, userAgent } = createLogInput.parse(input);

		const [logEntry] = await db
			.insert(accessLogs)
			.values({
				shortLinkId: shortId,
				ip,
				userAgent,
			})
			.returning();

		return makeRight(logEntry);
	} catch (error) {
		return makeLeft(error);
	}
}
