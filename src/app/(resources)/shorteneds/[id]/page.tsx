'use client'

import React, {useCallback, useEffect, useState} from "react";
import {SnackbarNotify} from "@/components/snackbar-notify";
import {AccessLog} from "@/types/AccessLog";

type NotifyMessage = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

export default function ShortenedPage({ params }: { params: { id: string } }) {
    const { id } = params

    const [processing, setProcessing] = useState<boolean>(true)
    const [accessLogInfos, setAccessLogInfos] = useState<AccessLog[] | null>(null)

    const [notifyMessage, setNotifyMessage] = useState<NotifyMessage>({
        message: '',
        severity: 'info',
    })

    const getAccessLogs = useCallback(async () => {
        if (!id) return
        try {
            setProcessing(true)
            const responseUrlInfos = await fetch(`/api/logs/${id}`)
            if (responseUrlInfos.status > 400) {
                setNotifyMessage({
                    message: 'Erro ao buscar os logs de acesso',
                    severity: 'error'
                })
            }
            const data = await responseUrlInfos.json()
            setAccessLogInfos(data)
        } catch (err) {
            console.error(err)
            setNotifyMessage({
                message: 'Erro ao buscar os logs de acesso',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }, [id])

  useEffect(() => {
      if (id) {
        getAccessLogs();
      }
  }, [getAccessLogs, id]);
  return (
      <>
          {processing && !accessLogInfos && (
                  <h2>Buscando informações... Aguarde!</h2>
          )}
          {accessLogInfos && accessLogInfos.length > 0 && (
              <>
                  <h2>Dados dos acessos:</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc'}}>
                      <thead style={{ backgroundColor: '#ccc', color: '#000' }}>
                            <tr style={{ height: '40px'}}>
                              <th>Data/Hora</th>
                              <th>Informações</th>
                              <th>IP</th>
                            </tr>
                      </thead>
                      <tbody>
                        {accessLogInfos.map((logInfo) => (
                            <tr key={logInfo.id}>
                                <td style={{ padding: '10px', border: '1px solid #fff' }}>{new Date(logInfo.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                                <td style={{ padding: '10px', border: '1px solid #fff' }}>{logInfo.userAgent}</td>
                                <td style={{ padding: '10px', border: '1px solid #fff' }}>{logInfo.ip}</td>
                            </tr>
                        ))}
                      </tbody>
                  </table>

              </>
          )}
          {!processing && !accessLogInfos && (
              <h2>Link não encontrado. Verifique o código informado.</h2>
          )}

          <div style={{ paddingTop: '20px' }}>
              <button
                  type="submit"
                  onClick={() => window.open(`${window.location.origin}`, '_self' )}
                  disabled={processing}
              >
                  Voltar para página inicial
              </button>
          </div>

          <SnackbarNotify message={notifyMessage.message} severity={notifyMessage.severity} setNotifyMessage={setNotifyMessage} />
      </>
  )
}