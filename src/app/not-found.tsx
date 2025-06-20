'use client'

import React, { useEffect } from 'react'

export default function NotFoundPage() {
  useEffect(() => {
    // direciona para a página inicial após 5 segundos
    setTimeout(() => {
      window.location.href = '/'
    }, 3000)
  })
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <h1>
        404 - Página não encontrada
      </h1>
      <h4>A página que você está procurando não existe.</h4>
      <h6>Estamos direcionando para a página inicial...</h6>
    </div>
  )
}
