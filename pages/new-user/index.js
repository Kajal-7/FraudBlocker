import React, { useState } from 'react'
import Card from '../../components/Card'
import Form from '../../components/FormCustomer'
import { Button } from '@mui/material';
import BackButton from '../../components/BackButton';

const index = () => {

    const [formSelected, setFormSelected] = useState('Retailer');
    const [flip, setFlip] = useState(false);

    const backContent = (
      <div>
        <BackButton onClick={()=>setFlip(false)}/>
        <Form
          formInputs={
            formSelected === 'Customer'
              ? formInputsCustomer
              : formInputsManufacturerAndRetailer
          }
          formTitle={`Register As ${formSelected}`}
        />
      </div>
    )

    const frontContent = (
      <div>
        <Button
          onClick={() => {
            setFlip(true)
            setFormSelected('Customer')
          }}
        >
          Customer
        </Button>
        <Button
          onClick={() => {
            setFlip(true)
            setFormSelected('Manufacturer')
          }}
        >
          Manufacturer
        </Button>
        <Button
          onClick={() => {
            setFlip(true)
            setFormSelected('Retailer')
          }}
        >
          Retailer
        </Button>
      </div>
    )

  return (
    <div style={{height: "100vh", display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Card flip={flip} frontContent={frontContent} backContent={backContent}/>
    </div>
  )
}

export default index