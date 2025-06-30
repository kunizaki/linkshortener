import type {AccessLog} from "./AccessLog";

export type ShortLink = {
    id: string
    shortId: string
    original: string
    createdAt: Date
    accesses?: AccessLog[]
}