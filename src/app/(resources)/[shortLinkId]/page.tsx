'use client'

import {useCallback, useEffect, useState} from "react";
import {SnackbarNotify} from "@/components/snackbar-notify";
import {ShortLink} from "@/types/ShortLink";

type NotifyMessage = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

export default function RedirectPage({ params }: { params: { shortLinkId: string } }) {
    const { shortLinkId } = params

    const [processing, setProcessing] = useState<boolean>(true)
    const [shortUrlInfos, setShortUrlInfos] = useState<ShortLink | null>(null)

    const [notifyMessage, setNotifyMessage] = useState<NotifyMessage>({
        message: '',
        severity: 'info',
    })

    const getUrlInfos = useCallback(async () => {
        try {
            setProcessing(true)
            const response = await fetch(`/api/links/${shortLinkId}`)
            if (response.status >= 400) {
                setNotifyMessage({
                    message: 'Erro ao buscar o link',
                    severity: 'error'
                })
                return
            }
            const data = await response.json()
            setShortUrlInfos(data)
        } catch (err) {
            console.error(err)
            setNotifyMessage({
                message: 'Erro ao buscar o link',
                severity: 'error'
            })
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
      <>
          {processing && !shortUrlInfos && (
                  <h2>Buscando informações... Aguarde!</h2>
          )}
          {shortUrlInfos && (
              <>
                  <h2>Link localizado... direcionando para o site:</h2>
                  <h1>{shortUrlInfos.original}</h1>
              </>
          )}
          {!processing && !shortUrlInfos && (
              <h2>Link não encontrado. Verifique o código informado.</h2>
          )}

          <SnackbarNotify message={notifyMessage.message} severity={notifyMessage.severity} setNotifyMessage={setNotifyMessage} />
      </>
  )
}
