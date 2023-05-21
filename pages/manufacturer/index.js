import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { Button, Grid } from '@mui/material'
import BackButton from '../../components/BackButton'
import FormCreateProduct from '../../components/Forms/FormCreateProduct'
import useEthereum from '../../ethereum/useEthereum'
import FormVerifyProduct from '../../components/Forms/FormVerifyProduct'
import FormMarkProductAsStolen from '../../components/Forms/FormMarkProductAsStolen'
import styles from '../../styles/Button.module.css';
import FormTransferOwnership from '../../components/Forms/FormTransferOwnership'
import { useRouter } from 'next/router'

const index = () => {

  const {contract,connectWallet, user} = useEthereum()
  const router = useRouter();

  useEffect(()=>{connectWallet()},[])
  useEffect(()=>{
    if(user!=null && user!=='manufacturer'){
      router.push('/');
    }
  }, [user]);
  const [formSelected, setFormSelected] = useState('Customer')
  const [flip, setFlip] = useState(false)

  const addRetailer = async (qrCodeValue,address) => {
    await contract.addRetailerToProduct(qrCodeValue,address)
  }
  
  const backContent = (
    <div>
      <BackButton onClick={() => {setFlip(false); }} />
      {formSelected === 'Verify Product' && <FormVerifyProduct contract={contract} />}
      {formSelected === 'Create Product' && <FormCreateProduct contract={contract}/>}
      {formSelected === 'Add Retailer' && <FormTransferOwnership addNewOwner={addRetailer} newOwner="Retailer" />}
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
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
      <Card frontContent={frontContent} backContent={backContent} flip={flip}/>
    </div>
  )
}

export default index
