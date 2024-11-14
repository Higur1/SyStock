import { Close } from '@mui/icons-material'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar } from '@mui/material'
import React from 'react'

export default function DialogCustom(props) {
  return (
    <>
      <Snackbar
        open={props?.snackbar?.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={props?.snackbar?.timeout}
        onClose={props?.snackbar?.onClose}
      >
        <Alert severity={props?.snackbar?.variant}>{props?.snackbar?.message}</Alert>
      </Snackbar>
      <Dialog open fullWidth {...props}>
        {!props.hideTitle ? (
          <>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {props.title}
              {props.hideCloseOnTitle ? null : (
                <IconButton onClick={props.onClose}>
                  <Close />
                </IconButton>
              )}
            </DialogTitle>
            <Divider />
          </>
        ) : null}
        <DialogContent>
          {props.children}
        </DialogContent>
        {props.hideActions ? null : (
          <DialogActions>
            <Button variant="contained" startIcon={props.cancelIcon} onClick={props.onCancel}>{props.labelCancel}</Button>
            <Button variant="contained" startIcon={props.confirmIcon} onClick={props.onConfirm}>{props.labelConfirm}</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}
