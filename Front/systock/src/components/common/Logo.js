import React from 'react'

export default function Logo() {
  return (
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', maxWidth: 240}}>
        <span style={{textAlign: 'center', fontWeight: 600, fontSize: 24}}>HGB System Stock</span>
        <span style={{textAlign: 'center', fontWeight: 400, fontSize: 16}}>Sistema de Gerenciamento de Estoque</span>
      </div>
  )
}
