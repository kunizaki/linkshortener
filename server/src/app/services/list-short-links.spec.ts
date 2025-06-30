import {describe, expect, it, vi} from "vitest";
import {isLeft, isRight} from "@/infra/shared/either";
import {listShortLinks} from "./list-short-links";
import {db as mockDb} from "@/infra/db";

vi.mock("@/infra/db", () => ({
	db: {
		query: {
			shortLinks: {
				findMany: vi.fn(),
			},
		},
	},
}));

const mockedFindMany = vi.mocked(mockDb.query.shortLinks.findMany);

describe("listShortLinks", () => {
	it("should return a list of short links with accesses when the query is successful", async () => {
		const mockData = [
			{
				id: "1",
				shortId: "abc123",
				original: "https://example.com",
				createdAt: new Date(),
				accesses: [],
			},
			{
				id: "2",
				shortId: "def456",
				original: "https://test.com",
				createdAt: new Date(),
				accesses: [
					{
						id: "1",
						shortLinkId: "def456",
						timestamp: new Date(),
						userAgent: "test-agent",
						ip: "127.0.0.1",
					},
				],
			},
		];
		mockedFindMany.mockResolvedValue(mockData);

		const response = await listShortLinks();

		expect(mockedFindMany).toHaveBeenCalledWith({
			with: { accesses: true },
		});

		expect(response).toHaveProperty("right");
		expect(isRight(response)).toBe(true);

		if (isRight(response)) {
			expect(response.right).toEqual(mockData);
		}
	});

	it("should return an error when an Error is thrown", async () => {
		const mockError = new Error("Database error");
		mockedFindMany.mockRejectedValue(mockError);

		const response = await listShortLinks();

		expect(mockedFindMany).toHaveBeenCalledWith({
			with: { accesses: true },
		});

		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		if (isLeft(response)) {
			expect(response.left).toBe(mockError);
		}
	});

	it("should return the error when a non-Error object is thrown", async () => {
		const mockError = "Some error";
		mockedFindMany.mockRejectedValue(mockError);

		const response = await listShortLinks();

		expect(mockedFindMany).toHaveBeenCalledWith({
			with: { accesses: true },
		});

		// Check that the response is an Either object with the correct error
		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		if (isLeft(response)) {
			expect(response.left).toBe(mockError);
		}
	});
});
