import {randomUUID} from "node:crypto";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createLog} from "@/app/services/create-log";
import {db} from "@/infra/db";
import {accessLogs} from "@/infra/db/schemas/database";
import {isLeft, isRight} from "@/infra/shared/either";

const mockInsertValuesReturning = vi.fn();

vi.mock("@/infra/db", () => {
	const mockDb = {
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

describe("create log", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should be able to create an access log", async () => {
		const mockLogInfo = {
			id: randomUUID(),
			shortLinkId: "abc123",
			ip: "192.168.1.1",
			userAgent: "Mozilla/5.0",
			timestamp: new Date(),
		};

		mockInsertValuesReturning.mockResolvedValueOnce([mockLogInfo]);

		const response = await createLog({
			shortId: "abc123",
			ip: "192.168.1.1",
			userAgent: "Mozilla/5.0",
		});

		expect(response).toHaveProperty("right");
		expect(isRight(response)).toBe(true);

		if (isRight(response)) {
			const responseData = response.right;
			expect(responseData).toEqual(mockLogInfo);
		}

		expect(db.insert).toHaveBeenCalledWith(accessLogs);
		expect(mockInsertValuesReturning).toHaveBeenCalled();
	});

	it("should handle errors and return a 500 response", async () => {
		mockInsertValuesReturning.mockRejectedValueOnce(
			new Error("Database error"),
		);

		const response = await createLog({
			shortId: "abc123",
			ip: "192.168.1.1",
			userAgent: "Mozilla/5.0",
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
		mockInsertValuesReturning.mockRejectedValueOnce("Unknown error");

		const response = await createLog({
			shortId: "abc123",
			ip: "192.168.1.1",
			userAgent: "Mozilla/5.0",
		});

		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		if (isLeft(response)) {
			expect(response.left).toBe("Unknown error");
		}
	});

	it("should validate input parameters", async () => {
		const response = await createLog({
			shortId: "abc123",
			ip: "192.168.1.1",
			userAgent: undefined as any,
		});

		expect(response).toHaveProperty("left");
		expect(isLeft(response)).toBe(true);

		expect(db.insert).not.toHaveBeenCalled();
	});
});
