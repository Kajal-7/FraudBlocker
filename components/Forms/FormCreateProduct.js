const crypto = require('crypto')
import { Alert, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
import { useRouter } from 'next/router'
import QRCode from 'qrcode'



const FormCreateProduct = ({ contract }) => {
  const [brand, setBrand] = useState()
  const [model, setModel] = useState()
  const [description, setDescription] = useState()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState();
  const [qrcodeImg, setQrcodeImg] = useState();


  function generateHash() {
    const buffer = crypto.randomBytes(32) // generates 32 random bytes
    const hash = buffer.toString('hex') // converts the buffer to a hexadecimal string
    return hash
  }

  const generateQRCode = async () => {
    try {
      const response = await QRCode.toDataURL(hash)
      setQrcodeImg(response)
    } catch (e) {
      console.log(e)
    }
  }

 
  function handleSubmit() {
    setLoading(true)
    setHash(generateHash())
    const createProduct = async () => {
      await contract.createProduct(hash, brand, model, description)
      await generateQRCode()
      
    }

    createProduct()
      .then(() => {
        
        setLoading(false)
        if (error) setError(false)
        setSuccess(true)
      })
      .catch((e) => {
        setLoading(false)
        if (success) setSuccess(false)
        setError(e.reason)
      })
    setBrand('')
    setDescription('')
    setModel('')
  }

  useEffect(() => {
    setError(false)
    setSuccess(false)
  }, [])

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Create A Product</a>
        <div className='inputBox1'>
          <input
            type='text'
            required='required'
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
          />
          <span className='user'>Brand</span>
        </div>
        <div className='inputBox1'>
          <input
            type='text'
            required='required'
            onChange={(e) => setModel(e.target.value)}
            value={model}
          />
          <span className='user'>Model</span>
        </div>
        <div className='inputBox1'>
          <input
            type='text'
            required='required'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <span className='user'>Description</span>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <button className='enter' onClick={handleSubmit}>
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
            {qrcodeImg && <img src={qrcodeImg}></img>}
          </>
        )}
      </div>
    </div>
  )
}

export default FormCreateProduct
