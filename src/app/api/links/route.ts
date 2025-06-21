import {PrismaClient} from "@prisma/client"

export async function GET(): Promise<Response> {
    try {
        // Buscar todos os links da base de dados
        const prisma = new PrismaClient()
        const links = await prisma.shortLink.findMany({
            include: {
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
        const prisma = new PrismaClient()
        const findDuplicate = await prisma.shortLink.findFirst({
            where: {
                shortId: body.shortId,
            }
        })
        if (findDuplicate) {
            return Response.json({ message: 'Já existe um link com esse código.'}, { status: 409 })
        }

        // Garante a unicidade do shortId gerado
        const shortUrlInfos = await prisma.shortLink.create({
            data: body
        })

        return Response.json(shortUrlInfos)
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 500 })
        } else {
            return Response.json({ message: "Erro na criação de link" }, { status: 500 })
        }
    }
}
