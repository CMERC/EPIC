const { v4: uuid } = require('uuid')
const { S3 } = require('aws-sdk')
const sharp = require('sharp')
const fetch = require('node-fetch')
const logger = require('../../logger')
const upload = {
  async singleUpload(parent, { file }, ctx, info) {
    const { createReadStream, filename, mimetype, encoding } = await file
    const secret = uuid()
    const size = createReadStream().length
    const s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
      params: {
        Bucket: process.env.S3_BUCKET
      },
      s3ForcePathStyle: true,
      signatureVersion: 'v4'
    })
    try {
      // Upload to S3
      const response = await s3
        .upload({
          Key: secret + '/' + filename,
          ACL: 'public-read',
          Body: createReadStream(),
          ContentLength: size,
          ContentType: mimetype,
          ContentDisposition: 'inline; filename ="' + filename + '"'
        })
        .promise()

      const pathURI =
        process.env.S3_EXTERNAL_ENDPOINT +
        '/' +
        response.Bucket +
        '/' +
        response.Key

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
        for (let urlItem in url) {
          if (url.hasOwnProperty(urlItem) && urlItem != 'raw') {
            url[urlItem] += ':' + urlItem
          }
        }

        let resizeList = {
          thumb: { width: 150 },
          small: { width: 340 },
          medium: { width: 600 },
          regular: { width: 1024 },
          large: { width: 1080 },
          full: { width: 1200 }
        }

        const imageResponse = await fetch(response.Location)
        if (!imageResponse.ok) {
          throw new Error('Unable to fetch uploaded image for resizing: ' + imageResponse.statusText)
        }
        const bodyBuffer = await imageResponse.buffer()

        for (let resizeItem in resizeList) {
          if (resizeList.hasOwnProperty(resizeItem)) {

            //Do no resize if value is larger than raw size
            resizeList[resizeItem].withoutEnlargement = true

            const data = await sharp(bodyBuffer)
              .rotate()
              .resize(resizeList[resizeItem])
              .toBuffer()

            await s3.putObject({
              Bucket: response.Bucket,
              Key: response.Key + ':' + resizeItem,
              ACL: 'public-read',
              Body: data,
              ContentType: mimetype,
              ContentDisposition: 'inline; filename ="' + filename + '"'
            }).promise()
          }
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

module.exports = { upload }
