import { useEffect, useState } from "react"
import FileUpload from "../file-upload/FileUpload"
import { UploadFileBtn } from "../file-upload/file-upload.styles"

const FormVerifyProduct = ({contract}) => {
  const [brand, setBrand] = useState()
  const [model, setModel] = useState()
  const [description, setDescription] = useState()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const [qrCode, setQrcode] = useState();

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      const imageBlob = new Blob([reader.result], { type: file.type })
      setQrcode(imageBlob)
    }

    reader.readAsArrayBuffer(file)
  }

  function handleSubmit() {
    setLoading(true)
    const createProduct = async () => {
      await contract.createProduct('dsaddasdddddda', brand, model, description)
    }

    createProduct()
      .then(() => {
        setLoading(false)
        if (error) setError(false)
        setSuccess(true)
      })
      .catch((e) => {
        setLoading(false)
        if (success) setSuccess(false)
        setError(e.reason)
      })
    setBrand('')
    setDescription('')
    setModel('')
  }

  useEffect(() => {
    setError(false)
    setSuccess(false)
  }, [])

  return (
    <div className='container'>
      <div className='card'>
        <a className='singup'>Verify A Product</a>
        <div className='inputBox1'>
          <input type='file' onChange={handleFileInput}>
            Upload QR Code
          </input>
          {qrCode && (
            <img src={URL.createObjectURL(qrCode)} alt='Uploaded Image' />
          )}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <button className='enter' onClick={handleSubmit}>
            Submit
          </button>
        )}
        {error && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='error'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert style={{ backgroundColor: 'transparent' }} severity='success'>
            Product Added Successfully
          </Alert>
        )}
      </div>
    </div>
  )

}

export default FormVerifyProduct