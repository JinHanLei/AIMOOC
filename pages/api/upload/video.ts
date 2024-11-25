import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' })
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 500MB
  })

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const file = files.file[0]
    const fileName = file.newFilename
    const fileUrl = `/uploads/${fileName}`

    return res.status(200).json({
      url: fileUrl,
      fileName: file.originalFilename,
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    return res.status(500).json({ error: '文件上传失败' })
  }
} 