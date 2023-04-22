import { useEffect, useRef, useState } from 'react'
import Loader from '../Loader'
import { Alert } from '@mui/material'
import {QrReader}  from 'react-qr-reader'

const FormMarkProductAsStolen = ({ contract }) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrCodeValue, setQRCodeValue] = useState()

  const markProductAsStolen =  () => {
     setLoading(true)
     contract.markProductAsStolen(qrCodeValue)
     .then(()=>{
       setSuccess(true)
     })
     .catch((e)=>{
      setError(e.reason)
     })
     setLoading(false)
  }

  useEffect(() => {
    if (qrCodeValue) {
      
      markProductAsStolen()
    }
  }, [qrCodeValue])

  useEffect(() => {
    setError(false)
    setLoading(false)
    setSuccess(false)
  }, [])

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Mark Product As Stolen</a>
        <div className='inputBox1'>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setQRCodeValue(result?.text)
              }

              if (!!error) {
                console.info(error)
              }
            }}
            style={{ width: '100%' }}
          />
        </div>

        

        {loading && <Loader />}

        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='error'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='success'>
            Marked The Product As Stolen
          </Alert>
        )}
      </div>
    </div>
  )
}


export default FormMarkProductAsStolen