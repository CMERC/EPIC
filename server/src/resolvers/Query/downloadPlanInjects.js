
const pdfMakePrinter = require('pdfmake/src/printer')
const resolverArgs = require('../arguments')
const momentTimezone = require('moment-timezone')

const downloadPlanInjects = {
  async downloadPlanInjects(parent, args, ctx, info) {
    if (args && args.where) {
      let orderBy
      if (args.where.orderBy) {
        orderBy = {
          orderBy: args.where.orderBy
        }
      }
      // Do not include deleted injects
      let newargs = resolverArgs.planInjectArgs(args.where)
      newargs = { ...newargs, ...orderBy }
      const planInjects = await ctx.db.query.planInjects(
        newargs,
        `{
            startDate number title owner {title}
            type method {name} events {name} status {title}
            from to trigger response remarks
            objectives {participant{name} platform{platform{title type}} jmet{description} trainedMethod}
           }
          `
      )
      let currentDate = (new Date()).toLocaleString(undefined, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      if (!info.workspaceTimeZone) {
        info.workspaceTimeZone = momentTimezone.tz.guess(true)
      }
      let title = 'EPIC Ready Master Scenario Events List for ' + info.workspaceDisplayName
      if (args.where.fileType === 'csv') {
        let columnsExcel = ['Date/Time', '#', 'Title', 'Status', 'Owner', 'Type ', 'Method', 'Event', 'From', 'To', 'Trigger', 'Anticipated Response', 'Training Objectives', 'Remarks']

        let CSV = ''
        //Set Report title in first row or line
        CSV += title + ',' + currentDate.toString() + '\r\n\n'

        let row = ''
        for (let i = 0; i < columnsExcel.length; i++) {
          row += columnsExcel[i] + ','
        }
        //append Label row with line break
        CSV += row + '\r\n'

        for (let i = 0; i < planInjects.length; i++) {
          let row = ''

          row += '"' + (planInjects[i].startDate ? momentTimezone.tz(planInjects[i].startDate, info.workspaceTimeZone).format('DD MMM YY - HHmm (z)') : '') + '",'
          row += '"' + planInjects[i].number + '",'
          row += '"' + planInjects[i].title + '",'
          row += '"' + (planInjects[i].status ? planInjects[i].status.title : 'None') + '",'
          row += '"' + (planInjects[i].owner ? planInjects[i].owner.title : ' ') + '",'
          row += '"' + planInjects[i].type + '",'
          row += '"' + (planInjects[i].method ? planInjects[i].method.name : ' ') + '",'

          row += '"' + (planInjects[i].events ? planInjects[i].events.name : ' ') + '",'
          row += '"' + planInjects[i].from + '",'
          row += '"' + planInjects[i].to + '",'
          row += '"' + planInjects[i].trigger.toString().replace(/"/g, '""') + '",'
          row += '"' + planInjects[i].response.toString().replace(/"/g, '""') + '",'

          let trainingObjs = []
          let objectives = planInjects[i].objectives
          for (let j = 0; j < objectives.length; j++) {
            let generateTitle = objectives[j].participant ? objectives[j].participant.name + ' ' : ''
            generateTitle += objectives[j].platform && objectives[j].platform.platform ? objectives[j].platform.platform.title + ' ' : ''
            generateTitle += objectives[j].platform && objectives[j].platform.platform ? objectives[j].platform.platform.type + ' ' : ''
            generateTitle += '-'
            generateTitle += objectives[j].jmet ? objectives[j].jmet.description + ' ' : ''
            generateTitle += objectives[j].trainedMethodType ? ('(' + objectives[j].trainedMethodType.title + ')') : ''
            trainingObjs.push(generateTitle)
          }
          // Training objectives
          row += '"' + trainingObjs.toString() + '",'
          row += '"' + planInjects[i].remarks.toString().replace(/"/g, '""') + '",'
          //add a line break after each row
          CSV += row + '\r\n'
        }
        return 'data:text/csv;charset=utf-8,' + escape(CSV)

      } else {
        // Default pdf
        const pdfData = await new Promise(async(resolve, reject) => {
          let fonts = {
            Roboto: {
              normal: 'src/fonts/Roboto-Regular.ttf',
              bold: 'src/fonts/Roboto-Medium.ttf',
              italics: 'src/fonts/Roboto-Italic.ttf',
              bolditalics: 'src/fonts/Roboto-MediumItalic.ttf'
            }
          }
          const printer = new pdfMakePrinter(fonts)

          let columns = ['Date/Time', '# Title', 'Status Owner', 'Type Method', 'Event', 'From-> To', 'Trigger', 'Anticipated Response', 'Training Objectives', 'Remarks']
          let injectsData = []
          for (let i = 0; i < planInjects.length; i++) {
            let trainingObjs = []
            let objectives = planInjects[i].objectives
            for (let j = 0; j < objectives.length; j++) {
              let generateTitle = objectives[j].participant ? objectives[j].participant.name + ' ' : ''
              generateTitle += objectives[j].platform && objectives[j].platform.platform ? objectives[j].platform.platform.title + ' ' : ''
              generateTitle += objectives[j].platform && objectives[j].platform.platform ? objectives[j].platform.platform.type + ' ' : ''
              generateTitle += '-'
              generateTitle += objectives[j].jmet ? objectives[j].jmet.description + ' ' : ''
              generateTitle += objectives[j].trainedMethodType ? ('(' + objectives[j].trainedMethodType.title + ')') : ''
              trainingObjs.push(generateTitle)
            }
            injectsData.push([
              {
                text: (planInjects[i].startDate ? momentTimezone.tz(planInjects[i].startDate, info.workspaceTimeZone).format('DD MMM YY - HHmm (z)') : ''), fontSize: 8
              },
              {
                text: '' + planInjects[i].number + ' - ' + planInjects[i].title, fontSize: 8
              },
              {
                stack: [
                  (planInjects[i].status ? planInjects[i].status.title : ''),
                  (planInjects[i].owner ? planInjects[i].owner.title : '')
                ], fontSize: 8
              },
              {
                stack: [
                  planInjects[i].type,
                  (planInjects[i].method ? planInjects[i].method.name : '')
                ], fontSize: 8
              },
              {
                text: planInjects[i].events ? planInjects[i].events.name : '', fontSize: 8
              },
              {
                stack: [
                  planInjects[i].from,
                  '->' + planInjects[i].to,
                ], fontSize: 8
              },
              {
                text: planInjects[i].trigger, fontSize: 8
              },
              {
                text: planInjects[i].response, fontSize: 8
              },
              {
                stack: [
                  {
                    ul: trainingObjs
                  }
                ], fontSize: 8
              },
              {
                text: planInjects[i].remarks, fontSize: 8
              }
            ])
          }
          let contentData = [
            {
              columns: [
                {
                  image: 'src/fonts/appicon.png', width: 35
                },
                { text: title, style: 'header' },
                { text: currentDate, width: 'auto' }
              ]
            },
            {
              table: {
                // ['Date/Time', '# Title', 'Status Owner', 'Type Method', 'Events', 'From-> To', 'Trigger', 'Response', 'Training Objectives','Remarks']
                widths: [35, 'auto', 45, 45, 'auto', 50, 120, 60, '*', 60],
                body: [
                  columns,
                  ...injectsData
                ]
              }
            }
          ]
          const docDefinition = {
            pageOrientation: 'landscape',
            pageSize: 'A4',
            pageMargins: [20, 15, 15, 20],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
              }
            },
            footer: (currentPage, pageCount) => { return { text: (currentPage.toString() + ' of ' + pageCount + ' '), alignment: 'center' } },
            content: contentData
          }
          const pdfDoc = printer.createPdfKitDocument(docDefinition)
          var chunks = []

          pdfDoc.on('readable', () => {
            let chunk
            while ((chunk = pdfDoc.read()) !== null) {
              chunks.push(chunk)
            }
          })
          pdfDoc.on('end', () => {
            resolve({ pdfDocument: Buffer.concat(chunks) })
          })
          pdfDoc.on('error', reject)
          pdfDoc.end()
        })

        return 'data:application/pdf;base64,' + pdfData.pdfDocument.toString('base64')
      }

    }

  }
}

module.exports = { downloadPlanInjects }
