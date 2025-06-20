import {PrismaClient} from "@prisma/client"
import {z} from "zod"

export async function GET(request: Request, { params }: { params: { shortLinkId: string } }): Promise<Response> {
    const shortLinkId = z.string().parse(params.shortLinkId)
    try {
        // Buscar um link da base de dados pelo shortId
        const prisma = new PrismaClient()
        const shortLink = await prisma.shortLink.findFirst({
            where: {
                shortId: shortLinkId
            }
        })

        if (!shortLink) {
            return Response.json({ message: 'Link não encontrado' }, { status: 404 })
        }

        return Response.json(shortLink)
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na busca do link" }, { status: 500 })
        }
    }
}

export async function PUT(request: Request, { params }: { params: { shortLinkId: string } }): Promise<Response> {
    const shortLinkId = z.string().parse(params.shortLinkId)
    const body = await request.json()
    try {
        // Atualiza um shortlink na base de dados
        const prisma = new PrismaClient()
        await prisma.shortLink.update({
            where: {
                id: shortLinkId
            },
            data: body
        })
        return Response.json({ message: 'Link atualizado com sucesso.'})
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na atualização do link" }, { status: 500 })
        }
    }
}

export async function DELETE(request: Request, { params }: { params: { shortLinkId: string } }): Promise<Response> {
    const shortLinkId = z.string().parse(params.shortLinkId)
    try {
        const prisma = new PrismaClient()
        const response = await prisma.shortLink.delete({
            where: {
                id: shortLinkId
            }
        })
        if (!response) {
            return Response.json({ message: "Erro na exclusão do link" }, { status: 500 })
        }
        return Response.json({ message: 'Link excluído com sucesso.'})
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na exclusão do link" }, { status: 500 })
        }
    }
}
