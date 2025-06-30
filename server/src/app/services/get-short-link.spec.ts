import {eq} from "drizzle-orm";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {shortLinks} from "@/infra/db/schemas/database";
import {makeLeft, makeRight} from "@/infra/shared/either";
import {NotFoundLink} from "./errors/not-found-link";
import {getShortLink} from "./get-short-link";
import {db} from "@/infra/db";

vi.mock("@/infra/shared/either", () => ({
	makeLeft: vi.fn(),
	makeRight: vi.fn(),
}));

vi.mock("@/infra/db", () => ({
	db: {
		query: {
			shortLinks: {
				findFirst: vi.fn(),
			},
		},
	},
}));

describe("getShortLink", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return the short link if found", async () => {
		const mockShortLink = {
			id: "1",
			shortId: "abc123",
			original: "https://example.com",
			createdAt: new Date(),
			accesses: [],
		};
		vi.mocked(db.query.shortLinks.findFirst).mockResolvedValue(mockShortLink);
		vi.mocked(makeRight).mockImplementation((value) => ({ right: value }));

		const result = await getShortLink({ shortId: "abc123" });

		expect(db.query.shortLinks.findFirst).toHaveBeenCalledWith({
			where: eq(shortLinks.shortId, "abc123"),
			with: { accesses: true },
		});
		expect(makeRight).toHaveBeenCalledWith(mockShortLink);
		expect(result).toEqual({ right: mockShortLink });
	});

	it("should return 'notFoundLink' error if link is not found", async () => {
		vi.mocked(db.query.shortLinks.findFirst).mockResolvedValue(undefined);
		vi.mocked(makeLeft).mockImplementation((error) => ({ left: error }));

		const result = await getShortLink({ shortId: "invalidId" });

		expect(db.query.shortLinks.findFirst).toHaveBeenCalledWith({
			where: eq(shortLinks.shortId, "invalidId"),
			with: { accesses: true },
		});
		expect(makeLeft).toHaveBeenCalledWith(expect.any(NotFoundLink));
		expect(result).toEqual({ left: expect.any(NotFoundLink) });
	});

	it("should return an error if a database issue occurs", async () => {
		const mockError = new Error("Database error");
		vi.mocked(db.query.shortLinks.findFirst).mockRejectedValue(mockError);
		vi.mocked(makeLeft).mockImplementation((error) => ({ left: error }));

		const result = await getShortLink({ shortId: "exceptionId" });

		expect(db.query.shortLinks.findFirst).toHaveBeenCalledWith({
			where: eq(shortLinks.shortId, "exceptionId"),
			with: { accesses: true },
		});
		expect(makeLeft).toHaveBeenCalledWith(mockError);
		expect(result).toEqual({ left: mockError });
	});
});
