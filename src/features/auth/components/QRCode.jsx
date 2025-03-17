const QRCode = ({ value, size = 200 }) => {
  // This is a placeholder component that would use a QR code library
  // In a real implementation, you would use a library like qrcode.react

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-4 rounded-xl" style={{ width: size, height: size }}>
        {/* This would be replaced with an actual QR code */}
        <div className="w-full h-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500">
          QR Code for: {value}
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Scan with your authenticator app</p>
    </div>
  )
}

export default QRCode

