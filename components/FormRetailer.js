const FormRetailer = () => {
  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>"Register As Retailer</a>

        <div className='inputBox1'>
          <input type='text' required='required' />
          <span className='user'>Name</span>
        </div>
        <div className='inputBox1'>
          <input type='text' required='required' />
          <span className='user'>Location</span>
        </div>

        <button className='enter'>Submit</button>
      </div>
    </div>
  )
}

export default FormRetailer
