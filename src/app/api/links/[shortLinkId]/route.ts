import { db } from "@/db"
import { shortLinks } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: Request, { params }: { params: { shortLinkId: string } }): Promise<Response> {
    const { shortLinkId: paramShortLinkId } = params
    const shortLinkId = z.string().parse(paramShortLinkId)
    try {
        // Buscar um link da base de dados pelo shortId
        const shortLink = await db.query.shortLinks.findFirst({
            where: eq(shortLinks.shortId, shortLinkId)
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
    const { shortLinkId: paramShortLinkId } = params
    const shortLinkId = z.string().parse(paramShortLinkId)
    const body = await request.json()
    try {
        // Atualiza um shortlink na base de dados
        const result = await db.update(shortLinks)
            .set(body)
            .where(eq(shortLinks.id, shortLinkId))
            .returning()

        if (result.length === 0) {
            return Response.json({ message: 'Link não encontrado' }, { status: 404 })
        }

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
    const { shortLinkId: paramShortLinkId } = await params
    const shortLinkId = z.string().parse(paramShortLinkId)
    try {
        const result = await db.delete(shortLinks)
            .where(eq(shortLinks.id, shortLinkId))
            .returning()

        if (result.length === 0) {
            return Response.json({ message: 'Link não encontrado' }, { status: 404 })
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
