import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, TextField } from '@mui/material';
import React from 'react'
import styled from 'styled-components';
import IconCustom from '../../../components/common/IconCustom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Title = styled('div')({
  fontSize: 24,
  fontWeight: 700
});

const TextFieldStyled = styled(TextField)({
  width: '100%'
});

function LocationDialog(props) {
  console.log(props.address)
  const { street, cep, number, district, state, city, complement } = props.address;


  function createGoogleMapsLink() {
    
    // Encode the address components for the URL
    const encodedStreet = encodeURIComponent(street);
    const encodedDistrict = encodeURIComponent(district);
    const encodedCity = encodeURIComponent(city);
    const encodedState = encodeURIComponent(state);
    
    // Construct the Google Maps URL
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedStreet}+${number},${encodedDistrict},${encodedCity},${encodedState}`;
    
    return googleMapsLink;
  }

  function goToUrl() {
    const url = createGoogleMapsLink();

    window.open(url, '_blank');
  }

  return (
    <Dialog
        open
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Endereço"}</Title></DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextFieldStyled
                disabled
                label="CEP"
                value={cep}
                variant="standard"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldStyled
                disabled
                label="Rua"
                value={street}
                variant="standard"
              />
            </Grid>
            <Grid item xs={2}>
              <TextFieldStyled
                disabled
                label="Número"
                value={number}
                variant="standard"
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldStyled
                disabled
                label="Complemento"
                value={complement}
                variant="standard"
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldStyled
                disabled
                label="Bairro"
                value={district}
                variant="standard"
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldStyled
                disabled
                label="Cidade"
                value={city}
                variant="standard"
              />
            </Grid>
            <Grid item xs={2}>
              <TextFieldStyled
                disabled
                label="Estado"
                value={state}
                variant="standard"
              />
            </Grid>
            <Grid item xs>
              <div style={{display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer'}} onClick={goToUrl}>
                <IconCustom type={'googleMaps'} />
                {"Ver no Google Maps"}
              </div>
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Voltar</Button>
        </DialogActions>

      </Dialog>
  )
}

export default LocationDialog