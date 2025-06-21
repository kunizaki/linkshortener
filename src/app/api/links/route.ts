import { db } from "@/db"
import { shortLinks } from "@/db/schema"
import { v4 as uuidv4 } from 'uuid'
import { eq } from "drizzle-orm"

export async function GET(): Promise<Response> {
    try {
        // Buscar todos os links da base de dados
        const links = await db.query.shortLinks.findMany({
            with: {
                accesses: true
            }
        })
        return Response.json(links)
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na busca de links" }, { status: 500 })
        }
    }
}

export async function POST(request: Request): Promise<Response> {
    const body = await request.json()
    try {
        // cria um shortlink na base de dados
        const findDuplicate = await db.query.shortLinks.findFirst({
            where: eq(shortLinks.shortId, body.shortId)
        })

        if (findDuplicate) {
            return Response.json({ message: 'Já existe um link com esse código.'}, { status: 409 })
        }

        // Garante a unicidade do shortId gerado e adiciona um ID gerado
        const [shortUrlInfos] = await db.insert(shortLinks).values({
            ...body,
            id: uuidv4()
        }).returning()

        return Response.json(shortUrlInfos)
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na criação de link" }, { status: 500 })
        }
    }
}
