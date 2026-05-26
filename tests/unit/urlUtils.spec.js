import { findUrls, hasUrl, withDefaultProtocol } from '@/shared/utils/url'

describe('url utilities', () => {
  it('finds explicit and plain host URLs', () => {
    expect(findUrls('Visit https://example.com and www.example.org')).toEqual([
      'https://example.com',
      'www.example.org'
    ])
  })

  it('does not treat ordinary words as URLs', () => {
    expect(hasUrl('this is only text')).toBe(false)
  })

  it('adds a default protocol when missing', () => {
    expect(withDefaultProtocol('example.com/path')).toBe('http://example.com/path')
    expect(withDefaultProtocol('https://example.com/path')).toBe('https://example.com/path')
  })
})
