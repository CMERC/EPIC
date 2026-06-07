jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(config => ({
    config,
    send: jest.fn()
  })),
  PutObjectCommand: jest.fn().mockImplementation(input => ({
    input
  }))
}))

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn().mockImplementation(({ client, params }) => ({
    client,
    params,
    done: jest.fn().mockResolvedValue({})
  }))
}))

const { Readable } = require('stream')
const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const { upload } = require('../resolvers/Mutation/upload')

test('singleUpload stores files through AWS SDK v3 and keeps media URL shape', async() => {
  process.env.S3_ACCESS_KEY_ID = 'access'
  process.env.S3_SECRET_ACCESS_KEY = 'secret'
  process.env.S3_ENDPOINT = 'http://minio:9000'
  process.env.S3_EXTERNAL_ENDPOINT = 'http://localhost/files'
  process.env.S3_BUCKET = 'epic'
  process.env.S3_REGION = 'us-test-1'

  const createMediaFile = jest.fn().mockImplementation(({ data }) => ({
    id: 'file-1',
    ...data
  }))
  const stream = Readable.from(['hello'])
  stream.length = 5

  const result = await upload.singleUpload(null, {
    file: Promise.resolve({
      createReadStream: () => stream,
      filename: 'report.txt',
      mimetype: 'text/plain',
      encoding: '7bit'
    })
  }, {
    db: {
      mutation: {
        createMediaFile
      }
    }
  })

  expect(S3Client).toHaveBeenCalledWith({
    region: 'us-test-1',
    endpoint: 'http://minio:9000',
    forcePathStyle: true,
    credentials: {
      accessKeyId: 'access',
      secretAccessKey: 'secret'
    }
  })
  expect(Upload).toHaveBeenCalledWith(expect.objectContaining({
    client: expect.any(Object),
    params: expect.objectContaining({
      Bucket: 'epic',
      ACL: 'public-read',
      Body: stream,
      ContentLength: 5,
      ContentType: 'text/plain',
      ContentDisposition: 'inline; filename ="report.txt"'
    })
  }))

  const uploadParams = Upload.mock.calls[0][0].params
  expect(uploadParams.Key).toMatch(/^[0-9a-f-]+\/report\.txt$/)
  expect(createMediaFile).toHaveBeenCalledWith({
    data: expect.objectContaining({
      name: 'report.txt',
      size: 5,
      contentType: 'text/plain',
      url: {
        thumb: 'http://localhost/files/epic/' + uploadParams.Key,
        small: 'http://localhost/files/epic/' + uploadParams.Key,
        regular: 'http://localhost/files/epic/' + uploadParams.Key,
        medium: 'http://localhost/files/epic/' + uploadParams.Key,
        large: 'http://localhost/files/epic/' + uploadParams.Key,
        full: 'http://localhost/files/epic/' + uploadParams.Key,
        raw: 'http://localhost/files/epic/' + uploadParams.Key
      }
    })
  })
  expect(result.url.raw).toBe('http://localhost/files/epic/' + uploadParams.Key)
})
