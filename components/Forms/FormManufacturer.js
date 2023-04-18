import { useState, useEffect } from "react"
import Loader from "../Loader";
import { Alert } from '@mui/material'
import { useRouter } from "next/router";

const FormManufacturer = ({contract}) => {
  const router = useRouter();
  const [name, setname] = useState();
  const [location, setlocation] = useState();
  const [success, setsuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setsuccess(false);
    setError(false);
  },[])

  function handleSubmit(){
     const addManufacturer = async()=>{
      await contract.createManufacturer(name, location, Date.now().toString());
     }
    addManufacturer().then(() => {
      setLoading(false);
      setsuccess(true);
      if (error) setError(false);
      router.push('/manufacturer');
    })
    .catch((e) => {
      setLoading(false);
      if (success) setsuccess(false);
      setError(e.reason);
    });
  setname('');
  setlocation(''); 
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
        {loading ? (<Loader/>) : <button className='enter' onClick={handleSubmit}>Submit</button>}
        {success && (
          <Alert style={{ backgroundColor: 'transparent' }} severity="success">Manufacturer Added Successfully</Alert>
        )}
        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity="error">{error}</Alert>
        )}
      </div>
    </div>
  )
}

export default FormManufacturer