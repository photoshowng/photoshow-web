import { Alert } from '@material-ui/core'
import React from 'react'

const Alertt = ({severity, message}) => {
  return (
    <Alert severity={severity}>{message}</Alert>
  )
}

export default Alertt
