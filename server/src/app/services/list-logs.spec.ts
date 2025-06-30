import {describe, expect, it, vi} from "vitest";
import {listLogs} from "./list-logs";
import {db as mockDb} from "@/infra/db";

vi.mock("@/infra/db", () => ({
	db: {
		query: {
			accessLogs: {
				findMany: vi.fn(),
			},
		},
	},
}));

const mockedFindMany = vi.mocked(mockDb.query.accessLogs.findMany);

describe("listLogs", () => {
	it("should return a list of access logs when the query is successful", async () => {
		const mockData = [
			{
				id: "1",
				shortLinkId: "abc123",
				ip: "127.0.0.1",
				userAgent: "test-agent-1",
				timestamp: new Date(),
			},
			{
				id: "2",
				shortLinkId: "def456",
				ip: "192.168.1.1",
				userAgent: "test-agent-2",
				timestamp: new Date(),
			},
		];
		mockedFindMany.mockResolvedValue(mockData);

		const response = await listLogs();

		expect(mockedFindMany).toHaveBeenCalled();
		expect(response).toBeInstanceOf(Response);
		expect(response.status).toBe(200);

		const result = await response.json();

		const expectedData = JSON.parse(JSON.stringify(mockData));
		expect(result).toEqual(expectedData);
	});

	it("should return a 500 response with error message when an Error is thrown", async () => {
		const errorMessage = "Database error";
		mockedFindMany.mockRejectedValue(new Error(errorMessage));

		const response = await listLogs();

		expect(mockedFindMany).toHaveBeenCalled();
		expect(response).toBeInstanceOf(Response);
		expect(response.status).toBe(500);

		const responseData = await response.json();
		expect(responseData).toEqual({ message: errorMessage });
	});

	it("should return a generic 500 response when a non-Error object is thrown", async () => {
		mockedFindMany.mockRejectedValue("Some error");

		const response = await listLogs();

		expect(mockedFindMany).toHaveBeenCalled();
		expect(response).toBeInstanceOf(Response);
		expect(response.status).toBe(500);

		const responseData = await response.json();
		expect(responseData).toEqual({
			message: "Erro na na busca dos logs de acesso",
		});
	});
});
