import { db } from "@/infra/db";

export async function listLogs(): Promise<Response> {
	try {
		const logsFound = await db.query.accessLogs.findMany();
		return Response.json(logsFound, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return Response.json({ message: error.message }, { status: 500 });
		} else {
			return Response.json(
				{ message: "Erro na na busca dos logs de acesso" },
				{ status: 500 },
			);
		}
	}
}
