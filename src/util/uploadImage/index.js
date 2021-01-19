import { create_UUID, SHA1 } from '../index'

export const uploadImage = async(file) => {
  const apiKey = process.env.REACT_APP_APIKey
  const cloudName = process.env.REACT_APP_cloudName
  const folderCloud = process.env.REACT_APP_folderCloud
  const secretKey = process.env.REACT_APP_secretAPIKey
  const public_id = create_UUID()
  const timestamp = Date.now()
  const signature = SHA1(`folder=${folderCloud}&public_id=${public_id}&timestamp=${timestamp}${secretKey}`)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', timestamp)
  formData.append('public_id', public_id)
  formData.append('folder', folderCloud)
  formData.append('signature', signature)
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}
