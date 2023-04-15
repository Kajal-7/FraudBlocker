import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { Button } from '@mui/material'
import BackButton from '../../components/BackButton'
import FormCreateProduct from '../../components/Forms/FormCreateProduct'
import useEthereum from '../../ethereum/useEthereum'
import FormVerifyProduct from '../../components/Forms/FormVerifyProduct'
import FormMarkProductAsStolen from '../../components/Forms/FormMarkProductAsStolen'
import FormAddRetailerToProduct from '../../components/Forms/FormAddRetailerToProduct'
import styles from '../../styles/Button.module.css';

const index = () => {

  const {contract,connectWallet} = useEthereum()
  useEffect(()=>{connectWallet()},[])

  const [formSelected, setFormSelected] = useState('Customer')
  const [flip, setFlip] = useState(false)
  
  const backContent = (
    <div>
      <BackButton onClick={() => {setFlip(false); }} />
      {formSelected === 'Verify Product' && <FormVerifyProduct contract={contract} />}
      {formSelected === 'Create Product' && <FormCreateProduct contract={contract}/>}
      {formSelected === 'Add Retailer' && <FormAddRetailerToProduct contract={contract} />}
      {formSelected === 'Mark Product As Stolen' && <FormMarkProductAsStolen contract={contract} />}
    </div>
  )

  const frontContent = (
    <div>
      <Button
        className={styles.btn}
        onClick={() => {
          setFlip(true)
          setFormSelected('Verify Product')
        }}
      >
        Verify Product
      </Button>
      <Button
        className={styles.btn}
        onClick={() => {
          setFlip(true)
          setFormSelected('Create Product')
        }}
      >
        Create Product
      </Button>
      <Button
        className={styles.btn}
        onClick={() => {
          setFlip(true)
          setFormSelected('Add Retailer')
        }}
      >
        Add Retailer
      </Button>
      <Button
        className={styles.btn}
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
