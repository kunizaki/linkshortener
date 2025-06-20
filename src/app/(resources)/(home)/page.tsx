'use client'

import React, {useEffect, useState} from "react";
import { z } from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";

import {
    AlertMessageElement,
    Box,
    BoxContainer,
    BoxForm,
    BoxTitle,
    ButtonCommand,
    Container,
    DownloadButton,
    InputDefault,
    ListAccessRow,
    ListBoxMessage,
    LogoElement,
    LinksHeader,
    SmallText,
    SubmitButton,
    TextLink
} from "./styles"

import {SnackbarNotify} from "@/components/snackbar-notify";

import { ShortLink } from "@/types/ShortLink";

import Loading from '@/assets/loading.gif'
import Logo from '@/assets/logo.png'
import DownloadIcon from '@/assets/icons/download.png'
import LinkIcon from '@/assets/icons/link-icon.png'
import CopyIcon from '@/assets/icons/copy.png'
import TrashIcon from '@/assets/icons/trash.png'
import AlertIcon from '@/assets/icons/alert.png'

type NotifyMessage = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

const schemaValidation = z.object({
    original: z.string().url({ message: 'Informe uma url válida.'}),
    shortId: z.string().refine((item) =>  /^[a-z]+$/.test(item), { message: 'Informe uma url minúscula e sem espaço/caracter especial.'})
})

type CreateFormData = z.infer<typeof schemaValidation>

export default function HomePage() {
    const isDesktop = window.innerWidth > 768

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<CreateFormData>({
        resolver: zodResolver(schemaValidation),
        defaultValues: {
            original: "",
            shortId: ""
        }
    })

    const [processing, setProcessing] = useState<boolean>(false)
    const [linksLoading, setLinksLoading] = useState<boolean>(false)
    const [shortLinks, setShortLinks] = useState<ShortLink[] | null>(null)

    const [notifyMessage, setNotifyMessage] = useState<NotifyMessage>({
        message: '',
        severity: 'info',
    })

    const getShortLinks = async () => {
        try {
            setLinksLoading(true)
            const response = await fetch(`/api/links`)
            if (!response.ok) {
                return
            }
            const data = await response.json()
            setShortLinks(data)

        } finally {
            setLinksLoading(false)
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

    const submitUrl = async (dataInputed: CreateFormData) => {
        try {
            setProcessing(true)
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataInputed)
            })
            if (!response.ok) {
                setNotifyMessage({
                    message: 'Erro ao gerar o link',
                    severity: 'error'
                })
                return
            }
            reset()
            await getShortLinks()
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

    const downloadCSV = async () => {
        try {
            setProcessing(true)
            const response = await fetch('/api/links/csv', {
                method: 'GET'
            })
            if (!response.ok) {
                setNotifyMessage({
                    message: 'Erro ao gerar arquivo csv',
                    severity: 'error'
                })
                return
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'links.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error(e)
            setNotifyMessage({
                message: 'Erro ao gerar arquivo csv',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        if (!shortLinks) {
            getShortLinks()
        }
    }, [shortLinks]);
  return (
      <Container>
          <LogoElement>
              <Image src={Logo} alt='Logomarca' width={50} height={50} />
              <h1>Encurtador de URL</h1>
          </LogoElement>
          <BoxContainer>
              <Box style={{ width: isDesktop ? '380px' : '100%' }}>
                  <BoxTitle style={{ marginTop: '18px'}}>Novo link</BoxTitle>
                  <BoxForm>
                      <form onSubmit={handleSubmit(submitUrl)} action="">
                        <SmallText>LINK ORIGINAL</SmallText>
                          <InputDefault
                              autoFocus={true}
                              id="original"
                              placeholder="https://www.exemplo.com.br"
                              onClick={() => clearErrors()}
                              {...register('original')}
                              disabled={processing}
                          />
                          {!!errors.original && (
                              <AlertMessageElement>
                                  <Image src={AlertIcon} alt="" width={16} height={16} />
                                  <SmallText style={{ color: 'red' }}>{errors.original?.message}</SmallText>
                              </AlertMessageElement>
                          )}
                          <SmallText>LINK ENCURTADO</SmallText>
                          <div style={{ position: 'relative', width: '100%' }}>
                              <div
                                  style={{
                                      position: 'absolute',
                                      left: '8px',
                                      top: '0',
                                      bottom: '0',
                                      zIndex: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#999', // Cor cinza para o texto fixo
                                      pointerEvents: 'none', // Impede interação com o prefixo fixo
                                      fontSize: '14px',
                                  }}
                              >
                                {window.location.origin}/
                              </div>
                              <InputDefault
                                  id="shortId"
                                  {...register('shortId')}
                                  onClick={() => clearErrors()}
                                  disabled={processing}
                                  style={{
                                      paddingLeft: '8px',
                                      width: '100%',
                                      boxSizing: 'border-box',
                                      textIndent: `${window.location.origin.length + 110}px`,
                                  }}
                              />
                          </div>

                      {!!errors.shortId && (
                              <AlertMessageElement>
                                  <Image src={AlertIcon} alt="" width={16} height={16} />
                                  <SmallText style={{ color: 'red' }}>{errors.shortId?.message}</SmallText>
                              </AlertMessageElement>
                          )}
                          <SubmitButton type="submit" disabled={processing}>{processing ? 'Salvando...' : 'Salvar link'}</SubmitButton>
                      </form>
                  </BoxForm>
              </Box>
              <Box style={{ flex: 1 }}>
                  <LinksHeader>
                      <BoxTitle>Meus links</BoxTitle>
                      <DownloadButton onClick={() => downloadCSV()}>
                          <Image src={DownloadIcon} alt="Download CSV" width={20} height={20} />
                          <SmallText fontSize={12}>Baixar CSV</SmallText>
                      </DownloadButton>
                  </LinksHeader>
                  <div style={{ height: '10px' }} />
                  <hr />
                      <ListBoxMessage>
                          {linksLoading && (
                              <>
                                  <Image src={Loading} alt="Loading..." width={50} height={50} />
                                  <SmallText>CARREGANDO LINKS...</SmallText>

                              </>
                          )}
                          {!shortLinks && !linksLoading && (
                              <>
                                  <hr />
                                  <Image src={LinkIcon} alt='Link Icon' width={30} height={30} />
                                  <SmallText>AINDA NÃO EXISTEM LINKS CADASTRADOS</SmallText>
                              </>
                          )}
                          {shortLinks && linksLoading && shortLinks.map((linkInfo) => (
                              <ListAccessRow key={linkInfo.id}>
                                  <hr />
                                  <div>
                                      <TextLink>{`${window.location.origin}/${linkInfo.shortId}`}</TextLink>
                                      <SmallText>{linkInfo.original}</SmallText>
                                  </div>
                                  <div>
                                      <SmallText>{`${linkInfo?.accesses ? linkInfo.accesses.length : 0} acessos`}</SmallText>
                                  </div>
                                  <div>
                                      <ButtonCommand onClick={()=> window.open(`${window.location.origin}/${linkInfo.shortId}`, '_blank')} >
                                          <Image src={CopyIcon} alt="Copiar Link" width={12} height={12} />
                                      </ButtonCommand>
                                      <ButtonCommand onClick={()=> removeShortedLink(linkInfo.id)} >
                                          <Image src={TrashIcon} alt="Excluir Link" width={12} height={12} />
                                      </ButtonCommand>

                                  </div>
                              </ListAccessRow>
                          ))}
                      </ListBoxMessage>
              </Box>
          </BoxContainer>

          <SnackbarNotify message={notifyMessage.message} severity={notifyMessage.severity} setNotifyMessage={setNotifyMessage} />
      </Container>
  )
}
