import { useState, useEffect } from "react"
import useEthereum from '../../ethereum/useEthereum'

const FormManufacturer = () => {
  const {connectWallet, contract, account} = useEthereum();
  const [name, setname] = useState();
  const [location, setlocation] = useState();

  useEffect(() => {
    connectWallet();   
  }, []);

  function handleSubmit(){
     const addManufacturer = async()=>{
     
      await contract.createManufacturer(name, location, Date.now().toString());

     }
     try {
      addManufacturer()
     } catch (error) {
      console.log(error)
     }
     
  }

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Register As Manufacturer</a>
        <div className='inputBox1'>
          <input type="text" required='required' onChange={(e)=>setname(e.target.value)} value={name}/>
          <span className='user'>Name</span>
        </div>
        <div className='inputBox1'>
          <input type="text" required='required' onChange={(e)=>setlocation(e.target.value)} value={location}/>
          <span className='user'>Location</span>
        </div>
        <button className='enter' onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}

export default FormManufacturer