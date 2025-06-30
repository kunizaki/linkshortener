import {Readable} from "stream";
import {uuidv7} from "uuidv7";
import {NotFoundLink} from "@/app/services/errors/not-found-link";
import {db} from "@/infra/db";
import {type Either, makeLeft, makeRight} from "@/infra/shared/either";
import {uploadFileToStorage} from "@/infra/storage/upload-file-to-storage";

type ShortLinkInfo = {
	id: string;
	shortId: string;
	original: string;
	createdAt: Date;
	accesses: {
		id: string;
		shortLinkId: string;
		timestamp: Date;
		userAgent: string;
		ip: string;
	}[];
};

export async function reportGenerate(): Promise<
	Either<unknown, { url: string }>
> {
	try {
		const shortLinks = await db.query.shortLinks.findMany({
			with: {
				accesses: true,
			},
		});

		if (!shortLinks || shortLinks.length === 0) {
			return makeLeft(new NotFoundLink());
		}

		const fileName = uuidv7();

		// Gerar arquivo CSV com os dados devolvidos com as colunas com os títulos: ID, Original URL, Short URL, Access Count e Created at
		const csvHeader = "ID,Original URL,Short URL,Access Count,Created at\n";

		// Formatar os dados para o CSV
		const csvRows = shortLinks
			.map((link: ShortLinkInfo) => {
				const accessCount = link.accesses.length;
				return `${link.id},${link.original},${link.shortId},${accessCount},${link.createdAt}`;
			})
			.join("\n");

		const csvContent = csvHeader + csvRows;
		const csvStream = Readable.from([csvContent]);

		const { key, url } = await uploadFileToStorage({
			folder: "reports",
			fileName,
			contentType: "text/csv; charset=utf-8",
			contentStream: csvStream,
		});

		return makeRight({ url });
	} catch (error) {
		return makeLeft(error);
	}
}
