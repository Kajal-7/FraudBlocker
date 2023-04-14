import { useState } from "react"

const FormManufacturer = () => {
  const {contract} = useEthereum();
  const [name, setname] = useState();
  const [location, setlocation] = useState();

  function handleSubmit(){
     const addManufacturer = async()=>{
      await contract.createManufacturer(name, location);
     }
     addManufacturer();
  }

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Register As Customer</a>
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