import { hasUrl, withDefaultProtocol } from '@/shared/utils/url'

function splitText(text) {
  let tempArray = text.split(/\s+/g)

  for (let i = 0; i < tempArray.length; i++) {
    if (hasUrl(tempArray[i])) {
      // set path encode uri
      tempArray.splice(
        i,
        1,
        process.env.APP_DOMAIN + '/link?url=' + encodeURIComponent(withDefaultProtocol(tempArray[i]))
      )
    }
  }
  text = tempArray.join(' ')

  return text
}
let testStrings = [
  'something        www.google.com',
  'Something \n http://www.google.com',
  'Something                      http://www.google.com'
]

test('Test returns', () => {
  for (let strings of testStrings) {
    //testing string to NOT have extra spaces in them
    expect(splitText(strings)).not.toMatch(/\s{2,}/g)
  }
})
