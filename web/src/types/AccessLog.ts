import type {ShortLink} from "./ShortLink";

export type AccessLog = {
    id: string
    shortLinkId: string
    timestamp: Date
    userAgent: string
    ip: string
    shortLink: ShortLink
}