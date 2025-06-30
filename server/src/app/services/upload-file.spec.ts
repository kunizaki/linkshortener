import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { InvalidFileFormat } from "@/app/services/errors/invalid-file-format";
import { uploadFile } from "@/app/services/upload-file";
import { isLeft, isRight, unwrapEither } from "@/infra/shared/either";

describe("upload file", () => {
	beforeAll(() => {
		vi.mock("@/infra/storage/upload-file-to-storage", () => {
			return {
				uploadFileToStorage: vi.fn().mockImplementation(() => {
					return {
						key: `${randomUUID()}.csv`,
						url: "https://storage.com/file.csv",
					};
				}),
			};
		});
	});

	it("should be able to upload an file", async () => {
		const fileName = `${randomUUID()}.jpg`;

		const sut = await uploadFile({
			fileName,
			contentType: "text/csv",
			contentStream: Readable.from([]),
		});

		expect(isRight(sut)).toBe(true);
	});

	it("should not be able to upload an invalid file", async () => {
		const fileName = `${randomUUID()}.pdf`;

		const sut = await uploadFile({
			fileName,
			contentType: "document/pdf",
			contentStream: Readable.from([]),
		});

		expect(isLeft(sut)).toBe(true);
		expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat);
	});
});
