import { useState } from "react"

const FormCustomer = () => {
  const {contract} = useEthereum();
  const [name, setname] = useState();
  const [phoneNo, setphoneNo] = useState();
  const [success, setsuccess] = useState(false);

  function handleSubmit(){
     const addCustomer = async()=>{
      await contract.createCustomer(name, phoneNo);
     }
     addCustomer()
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
          <input type="text" required='required' onChange={(e)=>setphoneNo(e.target.value)} value={phoneNo}/>
          <span className='user'>Phone Number</span>
        </div>
        <button className='enter' onClick={handleSubmit}>Submit</button>
        {success && <Alert severity="success">Customer Added Successfully</Alert>}
      </div>
    </div>
  )
}

export default FormCustomer