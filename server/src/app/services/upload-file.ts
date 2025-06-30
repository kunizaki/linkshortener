import { Readable } from "node:stream";
import { z } from "zod";
import { type Either, makeLeft, makeRight } from "@/infra/shared/either";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { InvalidFileFormat } from "./errors/invalid-file-format";

const uploadImageInput = z.object({
	fileName: z.string(),
	contentType: z.string(),
	contentStream: z.instanceof(Readable),
});

type UploadImageInput = z.input<typeof uploadImageInput>;

const allowedMimeTypes = ["text/csv"];

export async function uploadFile(
	input: UploadImageInput,
): Promise<Either<InvalidFileFormat, { url: string }>> {
	const { contentStream, contentType, fileName } =
		uploadImageInput.parse(input);

	if (!allowedMimeTypes.includes(contentType)) {
		return makeLeft(new InvalidFileFormat());
	}

	const { key, url } = await uploadFileToStorage({
		folder: "images",
		fileName,
		contentType,
		contentStream,
	});

	return makeRight({ url });
}
