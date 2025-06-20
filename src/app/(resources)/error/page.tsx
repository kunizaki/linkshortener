'use client'

import React from 'react'
import Image from "next/image";
import {BigText, BoxMessage, Container, Text} from "./styles";
import NotFoundImage from '@/assets/404.png'

export default function ErrorPage() {
  return (
    <Container>
        <BoxMessage>
            <Image src={NotFoundImage} alt="Não encontrado" width={300} height={200} style={{ height: 'auto' }} />
            <BigText>Link não encontrado</BigText>
            <Text fontSize={18} style={{ textAlign: 'center' }}>O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. saiba mais em <a href={window.location.origin}>Encurtador de Links</a></Text>
        </BoxMessage>
    </Container>
  )
}
