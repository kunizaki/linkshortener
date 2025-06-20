import {PrismaClient} from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET(): Promise<Response> {
    try {
        // Buscar todos os links da base de dados
        const prisma = new PrismaClient()
        const links = await prisma.shortLink.findMany({
            include: {
                accesses: true
            }
        })

        // Gerar arquivo CSV com os dados devolvidos com as colunas com os títulos: ID, Original URL, Short URL, Access Count e Created at
        const csvHeader = "ID,Original URL,Short URL,Access Count,Created at\n"

        // Formatar os dados para o CSV
        const csvRows = links.map(link => {
            const accessCount = link.accesses.length
            return `${link.id},${link.original},${link.shortId},${accessCount},${link.createdAt}`
        }).join('\n')

        const csvContent = csvHeader + csvRows

        // Retornar o arquivo CSV
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="links.csv"'
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error("Erro na busca de links")
        }
    }
}
