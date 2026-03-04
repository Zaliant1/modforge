import { request } from './client'

export const getPresignedUrl = (filename, contentType) =>
  request('post', '/api/uploads/presigned', {
    data: { filename, content_type: contentType },
  })

export const uploadToR2 = async (uploadUrl, content, contentType) => {
  const blob = new Blob([content], { type: contentType })
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': contentType },
  })
  return response.ok
}
