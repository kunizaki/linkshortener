import {useCallback, useEffect, useState} from "react";

import {BigText, BoxMessage, Container, Text} from "./styles";

import type {ShortLink} from "@/types/ShortLink";

import Logo from '@/assets/logo.png'
import {useNavigate, useParams} from "react-router-dom";
import {api} from "@/config/api.ts";

export default function RedirectPage() {
    const {shortLinkId} = useParams()
    const navigate = useNavigate()

    const [processing, setProcessing] = useState<boolean>(true)
    const [shortUrlInfos, setShortUrlInfos] = useState<ShortLink | null>(null)

    const getUrlInfos = useCallback(async () => {
        try {
            setProcessing(true)
            const response = await api.get(`/link/${shortLinkId}`)
            if (response.status >= 400) {
                navigate('/error')
                return
            }
            setShortUrlInfos(response?.data ?? null)
        } finally {
            setProcessing(false)
        }
    }, [shortLinkId])

    const redirectToOriginal = useCallback(async () => {
        if (!shortUrlInfos) return
        await api.post(`/logs`, {
            shortId: shortLinkId,
            userAgent: navigator.userAgent
        })
        // Redirect immediately
        window.location.href = shortUrlInfos.original
    }, [shortUrlInfos])

    useEffect(() => {
        if (shortUrlInfos) {
            redirectToOriginal()
        }
    }, [shortUrlInfos]);

    useEffect(() => {
        if (shortLinkId && !shortUrlInfos) {
            getUrlInfos()
        }
    }, [shortLinkId]);
    return (
        <Container>
            <BoxMessage>
                <img src={Logo} alt="Logo" width={100} height={100}/>
                {!processing && !shortUrlInfos ? (
                    <BigText>Link não encontrado. Verifique o código informado.</BigText>
                ) : (
                    <>
                        <BigText>Redirecionando...</BigText>
                        <Text fontSize={14}>O link será aberto automaticamente em alguns instantes. </Text>
                        <Text fontSize={14}>Não foi redirecionado? <a href={shortUrlInfos?.original}>Acesse
                            aqui</a></Text>
                    </>
                )}
            </BoxMessage>
        </Container>
    )
}
