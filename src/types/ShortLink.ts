import {AccessLog} from "@/types/AccessLog";

export type ShortLink = {
    id: string
    shortId: string
    original: string
    createdAt: Date
    accesses?: AccessLog[]
}