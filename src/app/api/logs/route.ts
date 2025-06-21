import {PrismaClient} from "@prisma/client"

/**
 * Extrai o endereço IP do cabeçalho x-forwarded-for
 * Se o IP estiver no formato IPv6 com IPv4 incorporado (::ffff:192.168.65.1),
 * extrai apenas a parte IPv4
 */
function extractIpAddress(ipAddress: string | null): string {
    if (!ipAddress) return 'unknown';

    // Se for o localhost IPv6 (::1), retorna seu equivalente IPv4
    if (ipAddress === '::1') {
        return 'localhost';
    }

    // Verifica se é um IPv6 com IPv4 incorporado (::ffff:IPv4)
    const ipv4Regex = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;
    const match = ipAddress.match(ipv4Regex);

    if (match && match[1]) {
        return match[1]; // Retorna apenas a parte IPv4
    }

    // Se for uma lista separada por vírgulas (comum com proxies), pega o primeiro
    if (ipAddress.includes(',')) {
        return ipAddress.split(',')[0].trim();
    }

    return ipAddress;
}

export async function GET(): Promise<object[]> {
    try {
        // Buscar todos os logs de acesso da base de dados
        const prisma = new PrismaClient()
        return prisma.accessLog.findMany()
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error("Erro na busca de logs")
        }
    }
}

export async function POST(request: Request): Promise<object> {
    const body = await request.json()
    try {
        // cria um log de acesso na base de dados
        const prisma = new PrismaClient()
        await prisma.accessLog.create({
            data: {
                shortLinkId: body.shortLinkId,
                ip: extractIpAddress(request.headers.get('x-forwarded-for')),
                userAgent: request.headers.get('user-agent') || ''
            }
        })
        return Response.json({ message: 'Log de acesso criado com sucesso.'})
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error("Erro na criação de log")
        }
    }
}