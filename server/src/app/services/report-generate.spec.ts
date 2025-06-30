import {describe, expect, it, vi} from "vitest";
import {db} from "@/infra/db";
import {uploadFileToStorage} from "@/infra/storage/upload-file-to-storage";
import {reportGenerate} from "./report-generate";

vi.mock("@/infra/db", () => ({
	db: {
		query: {
			shortLinks: {
				findMany: vi.fn(),
			},
		},
	},
}));

vi.mock("@/infra/storage/upload-file-to-storage", () => ({
	uploadFileToStorage: vi.fn(),
}));

vi.mock("@/infra/shared/either", () => ({
	makeLeft: vi.fn((value) => ({ left: value })),
	makeRight: vi.fn((value) => ({ right: value })),
}));

describe("reportGenerate", () => {
	it("should generate a report and return its URL when data exists", async () => {
		const mockData = [
			{
				id: "1",
				original: "https://example.com",
				shortId: "abc123",
				accesses: [
					{
						id: "access1",
						shortLinkId: "1",
						timestamp: new Date(),
						userAgent: "test-agent",
						ip: "127.0.0.1",
					},
					{
						id: "access2",
						shortLinkId: "1",
						timestamp: new Date(),
						userAgent: "test-agent",
						ip: "127.0.0.1",
					},
				],
				createdAt: new Date("2025-06-30"),
			},
		];
		const mockUrl = "https://storage.example.com/reports/report.csv";

		vi.mocked(db.query.shortLinks.findMany).mockResolvedValue(mockData);
		vi.mocked(uploadFileToStorage).mockResolvedValue({
			key: "reports/report.csv",
			url: mockUrl,
		});

		const result = await reportGenerate();

		expect(db.query.shortLinks.findMany).toHaveBeenCalledWith({
			with: { accesses: true },
		});
		expect(uploadFileToStorage).toHaveBeenCalled();
		expect(result).toEqual({ right: { url: mockUrl } });
	});

	it("should return a NotFoundLink error when no data exists", async () => {
		vi.mocked(db.query.shortLinks.findMany).mockResolvedValue([]);

		const result = await reportGenerate();

		expect(result).toEqual({ left: expect.any(Error) });
	});

	it("should handle errors thrown by the database query", async () => {
		const mockError = new Error("Database error");
		vi.mocked(db.query.shortLinks.findMany).mockRejectedValue(mockError);

		const result = await reportGenerate();

		expect(result).toEqual({ left: mockError });
	});

	it("should handle errors while uploading the file", async () => {
		const mockData = [
			{
				id: "1",
				original: "https://example.com",
				shortId: "abc123",
				accesses: [
					{
						id: "access1",
						shortLinkId: "1",
						timestamp: new Date(),
						userAgent: "test-agent",
						ip: "127.0.0.1",
					},
					{
						id: "access2",
						shortLinkId: "1",
						timestamp: new Date(),
						userAgent: "test-agent",
						ip: "127.0.0.1",
					},
				],
				createdAt: new Date("2025-06-30"),
			},
		];
		const mockError = new Error("Upload error");

		vi.mocked(db.query.shortLinks.findMany).mockResolvedValue(mockData);
		vi.mocked(uploadFileToStorage).mockRejectedValue(mockError);

		const result = await reportGenerate();

		expect(result).toEqual({ left: mockError });
	});
});
