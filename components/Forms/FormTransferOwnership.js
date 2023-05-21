import React, { useEffect, useState } from 'react'
import BackButton from '../BackButton'
import { QrReader } from 'react-qr-reader'
import Loader from '../Loader'
import { Alert } from '@mui/material'

const FormTransferOwnership = ({ addNewOwner, newOwner }) => {
  const [address, setAddress] = useState()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [getQR, setgetQR] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState()

  function handleChangeInOwnership() {
    setLoading(true)
    console.log(addNewOwner.toString())
    addNewOwner(qrCodeValue,address)
      .then(() => {
        setLoading(false)
        setSuccess(true)
      })
      .catch((e) => {
        setError(e.reason)
      })

    setAddress('')
  }

  useEffect(() => {
    setError(false)
    setSuccess(false)
  }, [])

  useEffect(() => {
    if (qrCodeValue) {
      handleChangeInOwnership()
    }
  }, [qrCodeValue])

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Transfer To {newOwner}</a>
        {getQR ? (
          <>
            <BackButton
              onClick={() => {
                setgetQR(false)
              }}
            />
            <div className='inputBox1'>
              <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    setQrCodeValue(result?.text)
                  }

                  if (!!error) {
                    console.info(error)
                  }
                }}
                style={{ width: '100%' }}
              />
            </div>
          </>
        ) : (
          <div className='inputBox1'>
            <input
              type='text'
              required='required'
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
            <span className='user'>Address</span>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <button
            className='enter'
            onClick={() => {
              setgetQR(true)
            }}
          >
            Submit
          </button>
        )}
        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='error'>
            {error}
          </Alert>
        )}
        {success && (
          <>
            <Alert
              style={{ backgroundColor: 'transparent' }}
              severity='success'
            >
              Product Added Successfully
            </Alert>
          </>
        )}
      </div>
    </div>
  )
}

export default FormTransferOwnership