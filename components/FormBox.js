import React, { useState } from 'react'
import Box from './Box'
import { Button } from '@mui/material';

const FormBox = ({Form, ButtonTitle}) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <Box>
       {showForm ? Form : <Button size='large' variant='contained' onClick={()=>setShowForm(true)} style={{padding: '2em'}}>{ButtonTitle}</Button>}
    </Box>
  )
}

export default FormBox