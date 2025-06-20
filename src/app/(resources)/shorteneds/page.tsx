'use client'

import {useEffect, useState} from "react";
import {SnackbarNotify} from "@/components/snackbar-notify";
import {ShortLink} from "@/types/ShortLink";
import { useRouter } from 'next/navigation'
import Image from "next/image";

import infoIcon from '@/assets/icons/information.png'
import deleteIcon from '@/assets/icons/delete.png'
import linkIcon from '@/assets/icons/link.png'

type NotifyMessage = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

export default function LinksPage() {
    const router = useRouter()
    const [processing, setProcessing] = useState<boolean>(true)
    const [shortLinks, setShortLinks] = useState<ShortLink[] | null>(null)

    const [notifyMessage, setNotifyMessage] = useState<NotifyMessage>({
        message: '',
        severity: 'info',
    })

    const getShortLinks = async () => {
        try {
            setProcessing(true)
            const response = await fetch(`/api/links`)
            if (response.status >= 400) {
                setNotifyMessage({
                    message: 'Erro ao buscar os links encurtados',
                    severity: 'error'
                })
                return
            }
            const data = await response.json()
            setShortLinks(data)
        } catch (err) {
            console.error(err)
            setNotifyMessage({
                message: 'Erro ao buscar os links encurtados',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }

    const removeShortedLink = async (linkId: string) => {
        if (!linkId) return
        try {
            setProcessing(true)
            const response = await fetch(`/api/links/${linkId}`, {
                method: 'DELETE'
            })
            if (response.status >= 400) {
                setNotifyMessage({
                    message: 'Erro ao excluir o link',
                    severity: 'error'
                })
                return
            }

            setNotifyMessage({
                message: 'Link excluído com sucesso',
                severity: 'success'
            })
            await getShortLinks()
        } catch (e) {
            console.error(e)
            setNotifyMessage({
                message: 'Erro ao excluir o link',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        if (!shortLinks){
            getShortLinks()
        }
    }, [shortLinks]);
  return (
      <>
          {processing && !shortLinks && (
                  <h2>Buscando informações... Aguarde!</h2>
          )}
          {shortLinks && (
              <>
                  <h2>Links cadastrados no sistema:</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc'}}>
                      <thead style={{ backgroundColor: '#ccc', color: '#000' }}>
                          <tr style={{ height: '40px'}}>
                              <th>Código</th>
                              <th>URL</th>
                              <th>Criação</th>
                              <th>-</th>
                          </tr>
                      </thead>
                      <tbody>
                      {shortLinks.map((linkInfo) => (
                          <tr key={linkInfo.id}>
                              <td style={{ padding: '10px', border: '1px solid #fff' }}>{linkInfo.shortId}</td>
                              <td style={{ padding: '10px', border: '1px solid #fff' }}>{linkInfo.original}</td>
                              <td style={{ padding: '10px', border: '1px solid #fff' }}>{new Date(linkInfo.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                              <td style={{ width: '100px' }}>
                                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', padding: '10px' }}>
                                      <Image src={linkIcon} alt='Acessar link' width={30} height={30} onClick={() => window.open(`${window.location.origin}/${linkInfo.shortId}`, '_self')} style={{cursor: 'pointer'}} />
                                      <Image src={infoIcon} alt='Detalhes do link' width={30} height={30} onClick={() => router.push(`/shorteneds/${linkInfo.shortId}`)} style={{cursor: 'pointer', paddingLeft: '10px', paddingRight: '10px'}} />
                                      <Image src={deleteIcon} alt='Excluir link' width={30} height={30} onClick={() => removeShortedLink(linkInfo.id)} style={{cursor: 'pointer', paddingLeft: '10px', paddingRight: '10px'}} />
                                  </div>
                              </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </>
          )}
          {!processing && !shortLinks && (
              <h2>Nenhum link encontrado.</h2>
          )}

          <SnackbarNotify message={notifyMessage.message} severity={notifyMessage.severity} setNotifyMessage={setNotifyMessage} />
      </>
  )
}
