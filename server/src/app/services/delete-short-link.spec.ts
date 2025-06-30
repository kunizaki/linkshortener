import {beforeEach, describe, expect, it, vi} from "vitest";
import {db} from "@/infra/db";
import {shortLinks} from "@/infra/db/schemas/database";
import {makeLeft, makeRight} from "@/infra/shared/either";
import {deleteShortLink} from "./delete-short-link";
import {NotFoundLink} from "./errors/not-found-link";

vi.mock("@/infra/shared/either", () => ({
	makeLeft: vi.fn(),
	makeRight: vi.fn(),
}));

const mockDeleteWhereReturning = vi.fn();

vi.mock("@/infra/db", () => {
	const mockDb = {
		delete: vi.fn().mockImplementation(() => {
			return {
				where: vi.fn().mockImplementation(() => {
					return {
						returning: mockDeleteWhereReturning,
					};
				}),
			};
		}),
	};

	return {
		db: mockDb,
	};
});

describe("deleteShortLink", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should delete the short link if it exists", async () => {
		const mockId = "1";
		const mockDeletionResult = [{ id: mockId, shortId: "abc123" }];

		mockDeleteWhereReturning.mockResolvedValue(mockDeletionResult);
		vi.mocked(makeRight).mockImplementation((value) => ({ right: value }));

		const result = await deleteShortLink({ id: mockId });

		expect(db.delete).toHaveBeenCalledWith(shortLinks);
		expect(mockDeleteWhereReturning).toHaveBeenCalled();
		expect(makeRight).toHaveBeenCalledWith({ result: mockDeletionResult });
		expect(result).toEqual({ right: { result: mockDeletionResult } });
	});

	it("should return 'NotFoundLink' error if the short link does not exist", async () => {
		const mockId = "invalidId";

		mockDeleteWhereReturning.mockResolvedValue([]);
		vi.mocked(makeLeft).mockImplementation((error) => ({ left: error }));

		const result = await deleteShortLink({ id: mockId });

		expect(db.delete).toHaveBeenCalledWith(shortLinks);
		expect(mockDeleteWhereReturning).toHaveBeenCalled();
		expect(makeLeft).toHaveBeenCalledWith(expect.any(NotFoundLink));
		expect(result).toEqual({ left: expect.any(NotFoundLink) });
	});

	it("should return an error if a database issue occurs", async () => {
		const mockId = "exceptionId";
		const mockError = new Error("Database error");

		mockDeleteWhereReturning.mockRejectedValue(mockError);
		vi.mocked(makeLeft).mockImplementation((error) => ({ left: error }));

		const result = await deleteShortLink({ id: mockId });

		expect(db.delete).toHaveBeenCalledWith(shortLinks);
		expect(mockDeleteWhereReturning).toHaveBeenCalled();
		expect(makeLeft).toHaveBeenCalledWith(mockError);
		expect(result).toEqual({ left: mockError });
	});
});
