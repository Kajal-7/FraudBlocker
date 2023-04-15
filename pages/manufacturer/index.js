import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import FormCustomer from '../../components/Forms/FormCustomer'
import FormRetailer from '../../components/Forms/FormRetailer'
import FormManufacturer from '../../components/Forms/FormManufacturer'
import { Button } from '@mui/material'
import BackButton from '../../components/BackButton'
import FormCreateProduct from '../../components/Forms/FormCreateProduct'
import useEthereum from '../../ethereum/useEthereum'

const index = () => {
  const [formSelected, setFormSelected] = useState('Customer')
  const [flip, setFlip] = useState(false)
  
  const {contract,connectWallet} = useEthereum()

  useEffect(()=>{connectWallet()},[])

 

  const backContent = (
    <div>
      <BackButton onClick={() => {setFlip(false); }} />
      {formSelected === 'Verify Product' && <FormCreateProduct />}
      {formSelected === 'Create Product' && <FormCreateProduct contract={contract}/>}
      {formSelected === 'Add Retailer' && <FormManufacturer />}
      {formSelected === 'Mark Product As Stolen' && <FormManufacturer />}
    </div>
  )

  const frontContent = (
    <div>
      <Button
        onClick={() => {
          setFlip(true)
          setFormSelected('Verify Product')
        }}
      >
        Verify Product
      </Button>
      <Button
        onClick={() => {
          setFlip(true)
          setFormSelected('Create Product')
        }}
      >
        Create Product
      </Button>
      <Button
        onClick={() => {
          setFlip(true)
          setFormSelected('Add Retailer')
        }}
      >
        Add Retailer
      </Button>
      <Button
        onClick={() => {
          setFlip(true)
          setFormSelected('Mark Product As Stolen')
        }}
      >
        Mark Product As Stolen
      </Button>
    </div>
  )

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card flip={flip} frontContent={frontContent} backContent={backContent} />
    </div>
  )
}

export default index
