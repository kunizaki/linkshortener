'use client'

import React from 'react'
import Image from "next/image";
import { BigText, BoxMessage, Container, Text } from "./styles";
import NotFoundImage from '@/assets/404.png'
import {useRouter} from "next/navigation";

export default function ErrorPage() {
    const router = useRouter()
  return (
    <Container>
        <BoxMessage>
            <Image src={NotFoundImage} alt="Não encontrado" width={300} height={200} style={{ height: 'auto' }} />
            <BigText>Link não encontrado</BigText>
            <Text fontSize={18} style={{ textAlign: 'center' }}>O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. saiba mais em <div onClick={() => router.push("/")}>Encurtador de Links</div></Text>
        </BoxMessage>
    </Container>
  )
}
