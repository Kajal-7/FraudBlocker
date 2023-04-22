import React from 'react'
import QRCode from 'qrcode.react'

const MyQRCodeComponent = ({ data }) => {
  return (
    <div>
      <h1>QR Code Example</h1>
      <QRCode value={data} />
    </div>
  )
}

export default MyQRCodeComponent
