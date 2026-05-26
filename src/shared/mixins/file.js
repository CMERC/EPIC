export default {
  methods: {
    generateDownloadBlob(attachment) {
      fetch(attachment.url.raw).then(response => {
        response.blob().then(responseData => {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(responseData)
          link.download = attachment.name
          link.click()
        })
      })
    },
    dataURItoBlob(dataURI) {
      // IE hack
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      let byteString = atob(dataURI.split(',')[1])
      // separate out the mime component
      let mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      // write the bytes of the string to an ArrayBuffer
      let ab = new ArrayBuffer(byteString.length)
      let ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      // write the ArrayBuffer to a blob, and you're done
      let bb = new Blob([ab], { type: mimeString })
      return bb
    },
    JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      let arrData =
        typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData

      let CSV = ''
      //Set Report title in first row or line
      CSV += ReportTitle + '\r\n\n'

      //This condition will generate the Label/Header
      if (ShowLabel) {
        let row = ''
        //This loop will extract the label from 1st index of on array
        for (let index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ','
        }
        row = row.slice(0, -1)
        //append Label row with line break
        CSV += row + '\r\n'
      }

      //1st loop is to extract each row
      for (let i = 0; i < arrData.length; i++) {
        let row = ''
        //2nd loop will extract each column and convert it in string comma-seprated
        for (let index in arrData[i]) {
          row += '"' + arrData[i][index] + '",'
        }
        row.slice(0, row.length - 1)
        //add a line break after each row
        CSV += row + '\r\n'
      }

      if (CSV == '') {
        alert('Invalid data')
        return
      }
      //Generate a file name
      let fileName = 'MyReport_'
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g, '_')

      //Initialize file format you want csv or xls
      let uri = 'data:text/csv;charset=utf-8,' + escape(CSV)

      //this trick will generate a temp <a /> tag
      let link = document.createElement('a')
      link.href = uri
      //set the visibility hidden so it will not effect on your web-layout
      link.style = 'visibility:hidden'
      link.download = fileName + '.csv'
      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
