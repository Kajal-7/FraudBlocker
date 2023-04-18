import { useState, useEffect } from "react"
import { Alert } from '@mui/material'
import Loader from "../Loader";
import { useRouter } from "next/router";

const FormRetailer = ({contract}) => {
  const router = useRouter();
  const [name, setname] = useState();
  const [location, setlocation] = useState();
  const [success, setsuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(){
     const addRetailer = async()=>{
      await contract.createRetailer(name, location);
     }
     addRetailer().then(() => {
      setLoading(false);
      setsuccess(true);
      if (error) setError(false);
      router.push("/retailer")
    })
    .catch((e) => {
      setLoading(false);
      if (success) setsuccess(false);
      setError(e.reason);
    });
  setname('');
  setlocation(''); 
  }

  useEffect(()=>{
    setsuccess(false);
    setError(false);
  },[])

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Register As Retailer</a>
        <div className='inputBox1'>
          <input type="text" required='required' onChange={(e)=>setname(e.target.value)} value={name}/>
          <span className='user'>Name</span>
        </div>
        <div className='inputBox1'>
          <input type="text" required='required' onChange={(e)=>setlocation(e.target.value)} value={location}/>
          <span className='user'>Location</span>
        </div>
        {loading ? (<Loader/>) : <button className='enter' onClick={handleSubmit}>Submit</button>}
        {success && (
          <Alert style={{ backgroundColor: 'transparent' }} severity="success">Retailer Added Successfully</Alert>
        )}
        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity="error">{error}</Alert>
        )}
      </div>
    </div>
  )
}

export default FormRetailer