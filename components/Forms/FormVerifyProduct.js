import { useEffect, useRef, useState } from 'react'
import Loader from '../Loader'
import { Alert } from '@mui/material'
import Quagga from 'quagga'
import {QrReader}  from 'react-qr-reader'

const FormVerifyProduct = ({ contract }) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrCodeValue, setQRCodeValue] = useState()
  const [productDetails, setProductDetails] = useState();

   const verifyProduct = async () => {
    const productDetails = await contract.getProductDetails(qrCodeValue)
    const productObj = {
      product: {
        brand: productDetails[1],
        model: productDetails[2],
        description: productDetails[3],
        status: parseInt(productDetails.status._hex, 16),
      },
      manufacturer: {
        name: productDetails[4].name,
        location: productDetails[4].location,
      },
      retailer: {
        name: productDetails[5].name,
        location: productDetails[5].location,
      },
      customers: productDetails[6],
    }
    setProductDetails(productObj)
   }

   useEffect(()=>{
      if(qrCodeValue){
        verifyProduct()
      }
   },[qrCodeValue])

 

  useEffect(() => {
    setError(false)
    setLoading(false)
    setSuccess(false)
  }, [])

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Verify A Product</a>
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

        {productDetails && (
          <div>
            <div>
              <h3>Product:</h3>
              {productDetails.product.status === 2 && <Alert severity='error'>Product Is Stolen!</Alert>}
              <p>
                Brand: {productDetails.product.brand} <br />
                Model: {productDetails.product.model} <br />
                Description: {productDetails.product.description}
              </p>
            </div>
            <div>
              <h3>Manufacturer: </h3>
              <p>
                Name: {productDetails.manufacturer.name} <br />
                Location: {productDetails.manufacturer.location}
              </p>
            </div>
            <div>
              <h3>Retailer: </h3>
              <p>
                Name: {productDetails.retailer.name} <br />
                Location: {productDetails.retailer.location}
              </p>
            </div>
            <div>
              <h3>Customers: </h3>
              <ul>
                {productDetails.customers.map(customer => 
                  <li>
                    Name: {customer.name}
                    Phone: {customer.phone}
                  </li>
                )}
              </ul>
              
            </div>
          </div>
        )}

        {loading && <Loader />}

        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='error'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='success'>
            Product Added Successfully
          </Alert>
        )}
      </div>
    </div>
  )
}

export default FormVerifyProduct
