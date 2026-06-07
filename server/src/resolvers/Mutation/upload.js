const { v4: uuid } = require('uuid')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const sharp = require('sharp')
const fetch = require('node-fetch')
const logger = require('../../logger')

const createS3Client = () => new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

const upload = {
  async singleUpload(parent, { file }, ctx) {
    const { createReadStream, filename, mimetype } = await file
    const secret = uuid()
    const size = createReadStream().length
    const s3 = createS3Client()
    const bucket = process.env.S3_BUCKET
    const key = secret + '/' + filename
    try {
      // Upload to S3
      await new Upload({
        client: s3,
        params: {
          Bucket: bucket,
          Key: key,
          ACL: 'public-read',
          Body: createReadStream(),
          ContentLength: size,
          ContentType: mimetype,
          ContentDisposition: 'inline; filename ="' + filename + '"'
        }
      }).done()

      const pathURI =
        process.env.S3_EXTERNAL_ENDPOINT +
        '/' +
        bucket +
        '/' +
        key

      let url = {
        thumb: pathURI,
        small: pathURI,
        regular: pathURI,
        medium: pathURI,
        large: pathURI,
        full: pathURI,
        raw: pathURI
      }


      //Do not resize gifs that may be animated or any file type that is not an image
      if (mimetype.includes('image') && mimetype.includes('gif') === false) {

        //Add resized url suffix
        for (let urlItem of Object.keys(url)) {
          if (urlItem !== 'raw') {
            url[urlItem] += ':' + urlItem
          }
        }

        const resizeList = {
          thumb: { width: 150 },
          small: { width: 340 },
          medium: { width: 600 },
          regular: { width: 1024 },
          large: { width: 1080 },
          full: { width: 1200 }
        }

        const imageResponse = await fetch(pathURI)
        if (!imageResponse.ok) {
          throw new Error('Unable to fetch uploaded image for resizing: ' + imageResponse.statusText)
        }
        const bodyBuffer = await imageResponse.buffer()

        for (let resizeItem of Object.keys(resizeList)) {
          //Do no resize if value is larger than raw size
          resizeList[resizeItem].withoutEnlargement = true

          const data = await sharp(bodyBuffer)
            .rotate()
            .resize(resizeList[resizeItem])
            .toBuffer()

          await s3.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key + ':' + resizeItem,
            ACL: 'public-read',
            Body: data,
            ContentType: mimetype,
            ContentDisposition: 'inline; filename ="' + filename + '"'
          }))
        }
      }

      // Sync with Prisma
      const data = {
        name: filename,
        size,
        secret,
        contentType: mimetype,
        url
      }
      // create media file
      const filedata = await ctx.db.mutation.createMediaFile({
        data
      })
      return filedata
    } catch (err) {
      logger.error(err)
    }
  }
}

module.exports = { upload, createS3Client }
