import { db } from "@/db"
import { accessLogs } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    const { id } = params
    const shortLink = z.string().parse(id)
    try {
        // Buscar um log da base de dados pelo ID
        const response = await db.query.accessLogs.findMany({
            where: eq(accessLogs.shortLinkId, shortLink)
        })

        if (response.length === 0) {
            return Response.json({ message: 'Dados de acessos não encontrados' }, { status: 404 })
        }

        return Response.json(response)
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na busca nos dados de acessos" }, { status: 500 })
        }
    }
}
