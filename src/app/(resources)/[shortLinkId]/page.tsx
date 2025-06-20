'use client'

import React, {useCallback, useEffect, useState} from "react";
import Image from "next/image";

import {BigText, BoxMessage, Container, Text} from "./styles";

import {ShortLink} from "@/types/ShortLink";

import Logo from '@/assets/logo.png'
import {useRouter} from "next/navigation";

export default function RedirectPage({ params }: { params: { shortLinkId: string } }) {
    const { shortLinkId } = params
    const router = useRouter()

    const [processing, setProcessing] = useState<boolean>(true)
    const [shortUrlInfos, setShortUrlInfos] = useState<ShortLink | null>(null)

    const getUrlInfos = useCallback(async () => {
        try {
            setProcessing(true)
            const response = await fetch(`/api/links/${shortLinkId}`)
            if (!response.ok) {
                router.push('/error')
                return
            }
            const data = await response.json()
            setShortUrlInfos(data)
        } finally {
            setProcessing(false)
        }
    }, [shortLinkId])

    const redirectToOriginal = useCallback(async () => {
        if (!shortUrlInfos) return
        await fetch(`/api/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shortLinkId
            })
        })
        setTimeout(() => {
            window.location.href = shortUrlInfos.original
        }, 2000)
    }, [shortLinkId, shortUrlInfos])

    useEffect(() => {
        if (shortUrlInfos) {
            redirectToOriginal()
        }
    }, [redirectToOriginal, shortUrlInfos]);

    useEffect(() => {
        if (shortLinkId) {
            getUrlInfos()
        }
    }, [getUrlInfos, shortLinkId]);
  return (
      <Container>
          <BoxMessage>
              <Image src={Logo} alt="Logo" width={50} height={50} />
              {!processing && !shortUrlInfos ? (
                      <BigText>Link não encontrado. Verifique o código informado.</BigText>
              ) : (
                  <>
                      <BigText>Redirecionando...</BigText>
                      <Text fontSize={14}>O link será aberto automaticamente em alguns instantes. </Text>
                      <Text fontSize={14}>Não foi redirecionado? <a href={shortUrlInfos?.original} >Acesse aqui</a></Text>
                  </>
              )}
          </BoxMessage>
      </Container>
  )
}
