'use client'

import {useState} from "react";
import {SnackbarNotify} from "@/components/snackbar-notify";
import {ShortLink} from "@/types/ShortLink";

type NotifyMessage = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

export default function HomePage() {
    const [url, setUrl] = useState<string>('')
    const [processing, setProcessing] = useState<boolean>(false)
    const [shortUrlInfos, setShortUrlInfos] = useState<ShortLink | null>(null)

    const [notifyMessage, setNotifyMessage] = useState<NotifyMessage>({
        message: '',
        severity: 'info',
    })

    const submitUrl = async () => {
        if (url === '') return
        try {
            setProcessing(true)
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    original: url
                })
            })
            if (!response.ok) {
                setNotifyMessage({
                    message: 'Erro ao gerar o link',
                    severity: 'error'
                })
            }
            const data = await response.json()
            setShortUrlInfos(data)
        } catch (err) {
            if (err instanceof Error) {
                setNotifyMessage({
                    message: err.message,
                    severity: 'error'
                })
            } else {
                setNotifyMessage({
                    message: 'Erro ao gerar o link',
                    severity: 'error'
                })
            }
        } finally {
            setProcessing(false)
        }
    }
  return (
      <>
          {!shortUrlInfos ? (
              <>
                  <h2>Insira o link para ser encurtado abaixo:</h2>
                  <input
                      autoFocus={true}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={processing}
                  />
                  <button
                      type="submit"
                      onClick={() => submitUrl()}
                      disabled={processing}
                  >
                      Encurtar esse URL
                  </button>
              </>
          ) : (
              <>
                  <h2>Seu link foi encurtado, utilize a URL abaixo para acessá-lo:</h2>
                  <div onClick={() => window.open(`${window.location.origin}/${shortUrlInfos.shortId}`, '_self' )} style={{ cursor: 'pointer' }}>
                    <h1>{`${window.location.href}${shortUrlInfos.shortId}`}</h1>
                  </div>
              </>
          )}

          <SnackbarNotify message={notifyMessage.message} severity={notifyMessage.severity} setNotifyMessage={setNotifyMessage} />
      </>
  )
}
