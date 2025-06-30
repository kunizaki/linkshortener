import {useEffect, useState} from "react";
import {z} from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

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
    LinksHeader,
    ListAccessRow,
    ListBoxMessage,
    LogoElement,
    SmallText,
    SubmitButton,
    TextLink
} from "./styles"

import {SnackbarNotify} from "@/components/snackbar-notify";

import type {ShortLink} from "@/types/ShortLink";

import Loading from '@/assets/loading.gif'
import Logo from '@/assets/logo.png'
import DownloadIcon from '@/assets/icons/download.png'
import LinkIcon from '@/assets/icons/link-icon.png'
import CopyIcon from '@/assets/icons/copy.png'
import TrashIcon from '@/assets/icons/trash.png'
import AlertIcon from '@/assets/icons/alert.png'
import {useDeviceSize} from "@/components/useDeviceSize";
import {api} from "@/config/api";

type NotifyMessage = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

const schemaValidation = z.object({
    original: z.string().url({message: 'Informe uma url válida.'}),
    shortId: z.string().refine((item: string) => /^[a-z0-9]+$/.test(item), {message: 'Informe uma url minúscula e sem espaço/caracter especial.'})
})

type CreateFormData = z.infer<typeof schemaValidation>

const Home = () => {
    const [windowWidth] = useDeviceSize()
    const [origin, setOrigin] = useState<string>('')

    // Safely get the origin URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin)
        }
    }, [])
    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors},
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

    const isMobile = () => {
        const maxWidthForMobile = 768
        return windowWidth <= maxWidthForMobile
    }

    const getShortLinks = async () => {
        try {
            setLinksLoading(true)
            const response = await api.get(`/links`)
            if (response.status >= 400) {
                setNotifyMessage({
                    message: 'Erro ao buscar os links',
                    severity: 'error'
                })
                return
            }
            setShortLinks(response?.data ?? [])
        } finally {
            setLinksLoading(false)
        }
    }

    const removeShortedLink = async (linkId: string) => {
        if (!linkId) return
        try {
            setProcessing(true)
            const response = await api.delete(`/link/${linkId}`)
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
            setNotifyMessage({
                message: 'Erro ao excluir o link',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }

    const submitUrl = async (dataReceived: CreateFormData) => {
        try {
            setProcessing(true)
            const response = await api.post('/links', dataReceived)
            if (response.status >= 400) {
                setNotifyMessage({
                    message: response?.data?.message ?? 'Erro ao gerar o link',
                    severity: 'error'
                })
                return
            }
            reset()
            await getShortLinks()
        } catch (err: any) {
            setNotifyMessage({
                message: err?.response?.data?.message ?? 'Erro ao gerar o link',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }

    const downloadCSV = async () => {
        try {
            setProcessing(true)
            const response = await api.get('/report', {
                method: 'GET'
            })
            if (response.status >= 400) {
                setNotifyMessage({
                    message: 'Erro ao gerar arquivo csv',
                    severity: 'error'
                })
                return
            }

            const csvInfos = response.data

            const a = document.createElement('a');
            a.href = csvInfos.url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            setNotifyMessage({
                message: 'Erro ao gerar arquivo csv',
                severity: 'error'
            })
        } finally {
            setProcessing(false)
        }
    }

    const copyToClipboard = (text: string) => {
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setNotifyMessage({
                        message: 'Link copiado...',
                        severity: 'success'
                    })
                })
                .catch(() => {
                    setNotifyMessage({
                        message: 'Erro ao copiar link',
                        severity: 'error'
                    })
                });
        } else {
            setNotifyMessage({
                message: 'Copia do link não é suportada neste navegador.',
                severity: 'error'
            })
        }
    };


    useEffect(() => {
        if (!shortLinks) {
            getShortLinks()
        }
    }, [shortLinks]);
    return (
        <Container>
            <LogoElement>
                <img src={Logo} alt='Logomarca' width={50} height={50}/>
                <h1>Encurtador de URL</h1>
            </LogoElement>
            <BoxContainer>
                <Box style={{width: isMobile() ? '100%' : '380px'}}>
                    <BoxTitle style={{marginTop: '18px'}}>Novo link</BoxTitle>
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
                                    <img src={AlertIcon} alt="" width={16} height={16}/>
                                    <SmallText style={{color: 'red'}}>{errors.original?.message}</SmallText>
                                </AlertMessageElement>
                            )}
                            <SmallText>LINK ENCURTADO</SmallText>
                            <div style={{position: 'relative', width: '100%'}}>
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
                                    {origin}/
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
                                        textIndent: `${origin.length + 110}px`,
                                    }}
                                />
                            </div>

                            {!!errors.shortId && (
                                <AlertMessageElement>
                                    <img src={AlertIcon} alt="" width={16} height={16}/>
                                    <SmallText style={{color: 'red'}}>{errors.shortId?.message}</SmallText>
                                </AlertMessageElement>
                            )}
                            <SubmitButton type="submit"
                                          disabled={processing}>{processing ? 'Salvando...' : 'Salvar link'}</SubmitButton>
                        </form>
                    </BoxForm>
                </Box>
                <Box style={{flex: 1}}>
                    <LinksHeader>
                        <BoxTitle>Meus links</BoxTitle>
                        <DownloadButton onClick={() => downloadCSV()} disabled={!shortLinks || shortLinks.length === 0}
                                        style={{
                                            cursor: shortLinks && shortLinks.length > 0 ? 'pointer' : 'not-allowed',
                                            color: !shortLinks || shortLinks.length === 0 ? '#cecece' : '#000000'
                                        }}>
                            <img src={DownloadIcon} alt="Download CSV" width={20} height={20}/>
                            <SmallText fontSize={12}>Baixar CSV</SmallText>
                        </DownloadButton>
                    </LinksHeader>
                    <div style={{height: '10px'}}/>
                    <hr/>
                    <ListBoxMessage>
                        {linksLoading && (
                            <div style={{padding: '50px', textAlign: 'center'}}>
                                <img src={Loading} alt="Loading..." width={50} height={50}/>
                                <SmallText>CARREGANDO LINKS...</SmallText>
                            </div>
                        )}
                        {!linksLoading && (!shortLinks || shortLinks.length === 0) && (
                            <div style={{padding: '50px', textAlign: 'center'}}>
                                <img src={LinkIcon} alt='Link Icon' width={30} height={30}/>
                                <SmallText>AINDA NÃO EXISTEM LINKS CADASTRADOS</SmallText>
                            </div>
                        )}
                        {shortLinks && shortLinks.length > 0 && !linksLoading && shortLinks.map((linkInfo) => (
                            <ListAccessRow key={linkInfo.id}>
                                <div
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            window.open(`${origin}/${linkInfo.shortId}`, '_blank')
                                        }
                                    }}
                                    style={{flex: 1, cursor: 'pointer'}}
                                >
                                    <TextLink>{`${origin}/${linkInfo.shortId}`}</TextLink>
                                    <SmallText>{linkInfo.original}</SmallText>
                                </div>
                                <div>
                                    <SmallText>{`${linkInfo?.accesses ? linkInfo.accesses.length : 0} acessos`}</SmallText>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <ButtonCommand onClick={() => copyToClipboard(`${origin}/${linkInfo.shortId}`)}>
                                        <img src={CopyIcon} alt="Copiar Link" width={12} height={12}/>
                                    </ButtonCommand>
                                    <ButtonCommand onClick={() => removeShortedLink(linkInfo.id)}>
                                        <img src={TrashIcon} alt="Excluir Link" width={12} height={12}/>
                                    </ButtonCommand>

                                </div>
                            </ListAccessRow>
                        ))}
                    </ListBoxMessage>
                </Box>
            </BoxContainer>

            <SnackbarNotify message={notifyMessage.message} severity={notifyMessage.severity}
                            setNotifyMessage={setNotifyMessage}/>
        </Container>
    )
}

export {Home}
