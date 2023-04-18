import { useState, useEffect} from "react";
import Loader from "../Loader";
import { Alert } from '@mui/material'
import { useRouter } from "next/router";

const FormCustomer = ({ contract }) => {
  const router = useRouter();
  const [name, setname] = useState();
  const [phoneNo, setphoneNo] = useState();
  const [success, setsuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setsuccess(false);
    setError(false);
  },[])

  function handleSubmit() {
    setLoading(true);
    const addCustomer = async () => {
      await contract.createCustomer(name, phoneNo);
    };
    addCustomer()
      .then(() => {
        setLoading(false);
        setsuccess(true);
        if (error) setError(false);
        router.push("/customer")
      })
      .catch((e) => {
        setLoading(false);
        if (success) setsuccess(false);
        setError(e.reason);
      });
    setname('');
    setphoneNo('');
}

  return (
    <div className="container">
      <div className="card">
        <a className="singup">Register As Customer</a>
        <div className="inputBox1">
          <input
            type="text"
            required="required"
            onChange={(e) => setname(e.target.value)}
            value={name}
          />
          <span className="user">Name</span>
        </div>
        <div className="inputBox1">
          <input
            type="text"
            required="required"
            onChange={(e) => setphoneNo(e.target.value)}
            value={phoneNo}
          />
          <span className="user">Phone Number</span>
        </div>
        {loading ? (<Loader/>) :  (<button className="enter" onClick={handleSubmit}>
          Submit
        </button>)}
        {success && (
          <Alert style={{ backgroundColor: 'transparent' }} severity="success">Customer Added Successfully</Alert>
        )}
        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity="error">{error}</Alert>
        )}
      </div>
    </div>
  );
};

export default FormCustomer;
