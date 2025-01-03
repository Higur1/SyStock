import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@mui/material";
import React from "react";
import PropTypes from 'prop-types';
import { Card, Container, Title, TitleH2 } from "./PriceDialog.styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const prices = [
  {
    title: 'Basic',
    price: '11,90',
    admin: 1,
    supervisor: 0,
    estoquista: 0
  },
  {
    title: 'Standard',
    price: '24,90',
    admin: 1,
    supervisor: 0,
    estoquista: 2
  },
  {
    title: 'Plus',
    price: '59,90',
    admin: 1,
    supervisor: 1,
    estoquista: 5
  },
  {
    title: 'Premium',
    price: '99,90',
    admin: 1,
    supervisor: 3,
    estoquista: 10
  }
];

const PriceDialog = (props) => {

  const { handleClose } = props;

  return (
    <Dialog
      open
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth="lg"
      style={{background: 'transparent', boxShadow: 'none'}}
      PaperProps={{style: { boxShadow: 'none', background: 'transparent'}}}
    >
      <DialogContent style={{height: 400}}>
        <Container>
            {prices.map((plan, index) => (
              <Card key={index}>
                <Title>
                    <TitleH2>{plan.title}</TitleH2>
                    <p style={{fontWeight: 600, paddingLeft: 16}}><span>{plan.price}</span>/month</p>
                </Title>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, padding: '0px 16px'}}>
                  <p style={{margin: 0}}>{`${plan.admin} usuário${plan.admin > 1 ? 's' : ''} Administrador${plan.admin > 1 ? 'es' : ''}`}</p>
                  <p style={{margin: 0}}>{`${plan.supervisor} usuário${plan.supervisor > 1 ? 's' : ''} Supervisor${plan.supervisor > 1 ? 'es' : ''}`}</p>
                  <p style={{margin: 0}}>{`${plan.estoquista} usuário${plan.estoquista > 1 ? 's' : ''} Estoquista${plan.estoquista > 1 ? 's' : ''}`}</p>
                </div>
                <Button style={{color: '#FFF'}}>Selecionar</Button>
            </Card>
            ))}
        </Container>
      </DialogContent>
    </Dialog>
  );
}

PriceDialog.propTypes = {
  handleClose: PropTypes.func.isRequired
}

export default PriceDialog;