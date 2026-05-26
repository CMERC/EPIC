import { DownloadPlanInjects } from '@/plan/graphql/PlanInjects.gql'
export default {
  methods: {
    planInjectExportFile(type, fileName, args) {
      this.$buefy.toast.open({
        message: 'Downloading...',
        type: 'is-success'
      })
      this.$apollo
        .query({
          query: DownloadPlanInjects,
          variables: args,
          // disable cache for query
          fetchPolicy: 'network-only'
        })
        .then(response => {
          if (navigator.msSaveBlob) {
            // Hack for IE support
            if (type === 'pdf') {
              let blob = this.dataURItoBlob(response.data.downloadPlanInjects)
              navigator.msSaveBlob(blob, fileName)
            } else {
              // csv
              navigator.msSaveBlob(
                new Blob(
                  [
                    unescape(response.data.downloadPlanInjects).replace(
                      'data:text/csv;charset=utf-8,',
                      ''
                    )
                  ],
                  {
                    type: 'text/csv;charset=utf-8;'
                  }
                ),
                fileName
              )
            }
          } else {
            let link = document.createElement('a')
            link.href = response.data.downloadPlanInjects
            link.style = 'visibility:hidden'
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject download: ' + error)
        })
    }
  }
}
