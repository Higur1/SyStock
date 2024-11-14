import React from 'react';
import LogoPNG from '../../images/LogoWithoutBackground.png';

export default function Logo() {
  return (
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', maxWidth: 240}}>
        {/* <span style={{textAlign: 'center', fontWeight: 600, fontSize: 24}}>HGB System Stock</span>
        <span style={{textAlign: 'center', fontWeight: 400, fontSize: 16}}>Sistema de Gerenciamento de Estoque</span> */}
        <img src={LogoPNG} alt="logo" style={{width: "100%", height: "100%"}}/>
      </div>
  )
}
