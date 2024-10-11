import { Button, Dialog, DialogContent, DialogTitle, Divider, Fab, IconButton } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components';
import Logo from '../../components/common/Logo';
import { Close, ContactSupport, Report, WhatsApp } from '@mui/icons-material';

const Container = styled.div`
  display: grid;
  grid-template:
    "info logo" 1fr
    "button button" 1fr
    / 1fr 1fr;
  padding: 48px;
  row-gap: 48px;
`;

const developers = [
  "Higor Hungria",
  "Gabriel Umebayashi",
  "Breno Marcondes",
];

export default function SupportPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab style={{position: 'absolute', bottom: 32, right: 32, zIndex: 2}} onClick={() => setOpen(true)} color={"primary"}>
        <ContactSupport />
      </Fab>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>Suporte</span>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Container>
            <div style={{ gridArea: "info", display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span>Versão do Sistema:</span>
                <strong>1.0.0</strong>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span>Desenvolvedores:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {developers.map((dev, i) => (<strong key={i}>{dev}</strong>))}
                </div>
              </div>
            </div>
            <div style={{ gridArea: "logo", display: 'flex', justifyContent: 'flex-end' }}>
              <Logo />
            </div>
            <div style={{ gridArea: "button", display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'flex-end' }}>
                <Button variant="contained" startIcon={<WhatsApp />}>{"Contate o Suporte"}</Button>
                <Button variant="contained" startIcon={<Report />}>{"Reportar um Problema"}</Button>
              </div>
            </div>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  )
}
