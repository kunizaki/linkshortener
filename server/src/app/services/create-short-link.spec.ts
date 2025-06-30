import {randomUUID} from "node:crypto";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createShortLink} from "@/app/services/create-short-link";
import {DuplicateShortLink} from "@/app/services/errors/duplicate-short-link";
import {isLeft, isRight} from "@/infra/shared/either";
import {db} from "@/infra/db";

const mockInsertValuesReturning = vi.fn();

vi.mock("@/infra/db", () => {
	const mockDb = {
		query: {
			shortLinks: {
				findFirst: vi.fn(),
			},
		},
		insert: vi.fn().mockImplementation(() => {
			return {
				values: vi.fn().mockImplementation(() => {
					return {
						returning: mockInsertValuesReturning,
					};
				}),
			};
		}),
	};

	return {
		db: mockDb,
	};
});

describe("create short link", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should be able to create a short link", async () => {
		const mockShortLinkInfo = {
			id: randomUUID(),
			shortId: "abc123",
			original: "https://example.com",
			createdAt: new Date(),
		};

		vi.mocked(db.query.shortLinks.findFirst).mockResolvedValueOnce(undefined);

		mockInsertValuesReturning.mockResolvedValueOnce([mockShortLinkInfo]);

		const response = await createShortLink({
			shortId: "abc123",
			original: "https://example.com",
		});

		expect(response).toHaveProperty("right");
		expect(isRight(response)).toBe(true);

		if (isRight(response)) {
			const responseData = response.right;
			expect(responseData).toEqual(mockShortLinkInfo);
		}

		expect(db.query.shortLinks.findFirst).toHaveBeenCalledWith({
			where: expect.anything(),
		});

		expect(db.insert).toHaveBeenCalled();
		expect(mockInsertValuesReturning).toHaveBeenCalled();
	});

	it("should return 409 when trying to create a short link with a duplicate shortId", async () => {
		vi.mocked(db.query.shortLinks.findFirst).mockResolvedValueOnce({
			id: randomUUID(),
			shortId: "abc123",
			original: "https://example.com",
			createdAt: new Date(),
		});

		const response = await createShortLink({
			shortId: "abc123",
			original: "https://example.com",
		});

		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		if (isLeft(response)) {
			const error = response.left;
			expect(error).toBeInstanceOf(DuplicateShortLink);
			expect((error as DuplicateShortLink).message).toBe(
				"Short link already exists.",
			);
		}

		expect(db.query.shortLinks.findFirst).toHaveBeenCalledWith({
			where: expect.anything(),
		});

		expect(db.insert).not.toHaveBeenCalled();
	});

	it("should handle errors and return a 500 response", async () => {
		vi.mocked(db.query.shortLinks.findFirst).mockRejectedValueOnce(
			new Error("Database error"),
		);

		const response = await createShortLink({
			shortId: "abc123",
			original: "https://example.com",
		});

		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		if (isLeft(response)) {
			const error = response.left;
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Database error");
		}
	});

	it("should handle unknown errors and return a generic 500 response", async () => {
		vi.mocked(db.query.shortLinks.findFirst).mockRejectedValueOnce(
			"Unknown error",
		);

		const response = await createShortLink({
			shortId: "abc123",
			original: "https://example.com",
		});

		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		if (isLeft(response)) {
			expect(response.left).toBe("Unknown error");
		}
	});
});
