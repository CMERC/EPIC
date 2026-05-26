export default {
  methods: {
    isVideo(url) {
      let data = false
      let videoTypes = ['mp4', 'mov', 'mpeg', 'avi', 'm4v']
      let ext = url.substring(url.lastIndexOf('.') + 1)
      if (videoTypes.indexOf(ext) !== -1) {
        data = true
      }
      return data
    },
    ifVideo(file) {
      if (!file) return
      let tester = RegExp('Video', 'i')
      if (tester.test(file)) {
        return true
      }
    },
    ifAudio(file) {
      if (!file) return
      let tester = RegExp('Audio', 'i')
      if (tester.test(file)) {
        return true
      }
    },
    ifImage(file) {
      if (!file) return
      let tester = RegExp('Image', 'i')
      if (tester.test(file)) {
        return true
      }
    },
    getIcon(contentType) {
      if (!contentType) return
      let icon = 'fas fa-file'
      return (
        contentType.match(/image/i) && (icon = 'fas fa-image'),
        contentType.match(/audio/i) && (icon = 'fas fa-file-audio'),
        contentType.match(/video/i) && (icon = 'fas fa-file-video'),
        contentType.match(/pdf/i) && (icon = 'fas fa-file-pdf'),
        contentType.match(/msword/i) && (icon = 'fas fa-file-word'),
        contentType.match(/word/i) && (icon = 'fas fa-file-word'),
        contentType.match(/excel/i) && (icon = 'fas fa-file-excel'),
        contentType.match(/spreadsheet/i) && (icon = 'fas fa-file-excel'),
        contentType.match(/powerpoint/i) && (icon = 'fas fa-file-powerpoint'),
        contentType.match(/presentation/i) && (icon = 'fas fa-file-powerpoint'),
        contentType.match(/text/i) && (icon = 'fas fa-file-alt'),
        contentType.match(/zip/i) && (icon = 'fas fa-file-archive'),
        icon
      )
    }
  }
}
