const { safeRedirectUrl } = require('../services/redirect')

test('safeRedirectUrl accepts http and https destinations', () => {
  expect(safeRedirectUrl('https%3A%2F%2Fexample.test%2Fpath')).toEqual({
    ok: true,
    url: 'https://example.test/path'
  })
  expect(safeRedirectUrl('http://example.test/path')).toEqual({
    ok: true,
    url: 'http://example.test/path'
  })
})

test('safeRedirectUrl rejects missing, relative, and non-web destinations', () => {
  expect(safeRedirectUrl(undefined)).toEqual({
    ok: false,
    status: 400,
    message: 'URL not defined in request'
  })
  expect(safeRedirectUrl('/local/path')).toEqual({
    ok: false,
    status: 400,
    message: 'Invalid redirect URL'
  })
  expect(safeRedirectUrl('ftp://example.test/file')).toEqual({
    ok: false,
    status: 400,
    message: 'Invalid redirect URL'
  })
})
