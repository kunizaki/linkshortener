import {PrismaClient} from "@prisma/client"
import {z} from "zod"

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    const shortLink = z.string().parse(params.id)
    try {
        // Buscar um log da base de dados pelo ID
        const prisma = new PrismaClient()
        const response =  await prisma.accessLog.findMany({
            where: {
                shortLinkId: shortLink
            }
        })
        if (!response) {
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