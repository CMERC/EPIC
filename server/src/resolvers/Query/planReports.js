
const helpers = {
  async getTraningObjsXAxisData(args, ctx, dateRange, type) {
    if (dateRange && type === 'Assessment') {
      args.where = {
        ...args.where,
        assessments_some: dateRange
      }
    }
    let totalAssessments = []
    let planTrainingObjs = await ctx.db.query.planTrainingObjectives(
      args, '{id assessments{id complete status}}'
    )
    if (type === 'Feedback') {
      // evaluations of each training obj
      for (let l = 0; l < planTrainingObjs.length; l++) {
        let evaluationsPerTO = await ctx.db.query.planEvaluations(
          { where: { trainingObjectives: { id: planTrainingObjs[l].id } } }, '{id complete status}'
        )
        totalAssessments = [
          ...totalAssessments,
          ...evaluationsPerTO
        ]
      }
    } else {
      // get list of all assessments of all traning obj
      for (let j = 0; j < planTrainingObjs.length; j++)
        totalAssessments = [
          ...totalAssessments,
          ...planTrainingObjs[j].assessments
        ]
    }
    // count complete and incomplete assessments
    let totalCompleteAssessments = 0
    let totalInCompleteAssessments = 0
    for (let k = 0; k < totalAssessments.length; k++) {
      if (totalAssessments[k].complete) totalCompleteAssessments++
      else totalInCompleteAssessments++
    }
    return {
      complete: totalCompleteAssessments,
      incomplete: totalInCompleteAssessments
    }
  },
  async getParticipantAudienceXAxisData(args, ctx) {
    let planParticipants = await ctx.db.query.planParticipants(
      args, '{id totalAudience}'
    )
    let totalAudiencePerType = 0

    for (let j = 0; j < planParticipants.length; j++)
      totalAudiencePerType += parseInt(planParticipants[j].totalAudience, 10)
    return totalAudiencePerType
  },
  async getParticipantsTotal(args, ctx) {
    let planParticipants = await ctx.db.query.planParticipantsConnection(args, '{aggregate {count}}')

    return planParticipants.aggregate.count
  },
}
const planReportQueries = {
  async getPlanReport(parent, args, ctx, info) {
    let chartData = []
    let total = 0
    let completeFormat = {
      name: 'Complete',
      textposition: 'auto',
      orientation: 'h',
      marker: {
        color: 'rgba(126,223,126,1)',
        width: 1
      },
      type: 'bar'
    }
    let inCompleteFormat = {
      name: 'Incomplete',
      orientation: 'h',
      type: 'bar',
      textposition: 'auto',
      marker: {
        color: 'rgba(243,120,120,1)',
        width: 1
      }
    }
    if (args && args.where && args.where.type) {
      let yAxis = []
      let xComplete = []
      let xIncomplete = []
      let xDisplayValueComplete = []
      let xDisplayValueIncomplete = []
      let dateRange
      if (args && args.where.startDate && args.where.endDate) {
        dateRange = {
          createdAt_lte: args.where.endDate,
          createdAt_gte: args.where.startDate
        }
      }
      switch (args.where.type) {
      case 'ObjsPerTrainingObjs': {
        let xAxisCount = []
        let xAxisCountDisplay = []
        let xAxisCountTotal = 0
        let perTrainingObjType = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'Exercise Objectives'
        let sourceType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'Assessment'
        switch (perTrainingObjType) {
        case 'Exercise Objectives': {
          let planExerciseObjectives = await ctx.db.query.planExerciseObjectives()
          for (let i = 0; i < planExerciseObjectives.length; i++) {
            // get trainingObjective counts per excercise
            let args = {
              where: {
                exerciseObjective_some: {
                  id: planExerciseObjectives[i].id
                }
              }
            }
            //get complete, incomplete percentage of total trainingObjectives per excercise
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              // List for Yaxis labels, excercise objective title
              if (planExerciseObjectives[i].title)
                yAxis.push(planExerciseObjectives[i].title)
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        case 'Accredited Task': {
          let planAccreditedTasks = await ctx.db.query.planAccreditedTasks({}, '{ id jmet{ taskTitle levelWar taskNumber } }')
          for (let i = 0; i < planAccreditedTasks.length; i++) {
            // get trainingObjective counts per accredited task
            let args = {
              where: {
                accreditedTask_some: {
                  id: planAccreditedTasks[i].id
                }
              }
            }
            //get complete, incomplete percentage of total trainingObjectives per accredited task
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              // List for Yaxis labels, accredited task title
              if (planAccreditedTasks[i].jmet && planAccreditedTasks[i].jmet.taskTitle) {
                yAxis.push(`${planAccreditedTasks[i].jmet.levelWar} ${planAccreditedTasks[i].jmet.taskNumber} ${planAccreditedTasks[i].jmet.taskTitle}`)
              }
              else yAxis.push('unknow title')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        case 'Joint Staff Training Priority': {
          let planJointStaffTrainingPriorities = await ctx.db.query.planJointStaffTrainingPriorities()
          for (let i = 0; i < planJointStaffTrainingPriorities.length; i++) {
            // get trainingObjective counts per plan Joint Staff Training Priority
            let args = {
              where: {
                jointStaffTrainingPriority_some: {
                  id: planJointStaffTrainingPriorities[i].id
                }
              }
            }
            //get random complete, incomplete percentage of total trainingObjectives per plan Joint Staff Training Priority
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              // List for Yaxis labels, title of  plan Joint Staff Training Priority
              if (planJointStaffTrainingPriorities[i].title) {
                yAxis.push(planJointStaffTrainingPriorities[i].title)
              }
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        case 'Command Priority': {
          let planCommandPriorities = await ctx.db.query.planCommandPriorities()
          for (let i = 0; i < planCommandPriorities.length; i++) {
            // get trainingObjective counts per Plan Command Priority
            let args = {
              where: {
                commandTrainingPriority_some: {
                  id: planCommandPriorities[i].id
                }
              }
            }

            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            //get complete, incomplete percentage of total trainingObjectives per Plan Command Priority
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              // List for Yaxis labels, title of  Plan Command Priority
              if (planCommandPriorities[i].title) {
                yAxis.push(planCommandPriorities[i].title)
              }
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        }
        if (xAxisCountTotal > 0) {
          for (let k = 0; k < xAxisCount.length; k++) {
            xAxisCountDisplay.push(`${xAxisCount[k]} (${((xAxisCount[k] / xAxisCountTotal) * 100).toFixed(2)}%)`)
          }
        }
        let completeDataCount = {
          type: 'bar',
          y: yAxis,
          x: xAxisCount,
          orientation: 'h',
          text: xAxisCountDisplay,
          textposition: 'auto'
        }
        let completeDataPer = {
          x: xComplete,
          y: yAxis,
          text: xDisplayValueComplete,
          ...completeFormat
        }
        let inCompleteDataPer = {
          x: xIncomplete,
          y: yAxis,
          text: xDisplayValueIncomplete,
          ...inCompleteFormat
        }
        // data for second graph
        chartData = [
          inCompleteDataPer,
          completeDataPer,
          completeDataCount
        ]
        total = xAxisCountTotal
        break
      }
      case 'ParticipantTypeFeedbackTasks': {
        let type = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'All'
        let xAxisCount = []
        let xAxisCountDisplay = []
        let argsForMissionTasks = {}
        if (type && type !== 'All') {
          argsForMissionTasks = {
            where: {
              participantType: { title: type }
            }
          }
        }
        let planMissionTasks = await ctx.db.query.planMissionTasks(argsForMissionTasks)
        for (let i = 0; i < planMissionTasks.length; i++) {
          // get feedback tasks numberCompleted
          let args = {
            where: {
              task: { title: planMissionTasks[i].title }
            }
          }
          let totalfeedbackTasksPerType = await ctx.db.query.planFeedbackTasks(args)
          if (totalfeedbackTasksPerType && totalfeedbackTasksPerType.length > 0) {
            yAxis.push(planMissionTasks[i].title)
            let totalNumCompleted = 0
            for (let k = 0; k < totalfeedbackTasksPerType.length; k++) {
              totalNumCompleted += totalfeedbackTasksPerType[k].numberCompleted
            }
            xAxisCount.push(totalNumCompleted)
            total = total + (totalNumCompleted)
          }
        }
        if (total > 0) {
          for (let k = 0; k < xAxisCount.length; k++) {
            xAxisCountDisplay.push(`${xAxisCount[k]} (${((xAxisCount[k] / total) * 100).toFixed(2)}%)`)
          }
        }
        chartData = [
          {
            type: 'bar',
            y: yAxis,
            x: xAxisCount,
            orientation: 'h',
            text: xAxisCountDisplay,
            textposition: 'auto'
          }
        ]
        break
      }
      case 'ParticipantsPerTOs':
      case 'ParticipantAudiencePerTOs': {
        let perTrainingObjType = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'Participant Type'
        let query = helpers.getParticipantAudienceXAxisData

        if (args.where.type === 'ParticipantsPerTOs')
          query = helpers.getParticipantsTotal

        let xAxisCount = []
        let xAxisCountDisplay = []
        switch (perTrainingObjType) {
        case 'Participant Type': {
          let participantTypeValues = await ctx.db.query.planParticipantTypes()
          for (let i = 0; i < participantTypeValues.length; i++) {
            // get audience counts for participantType
            let args = {
              where: {
                participantType: { title: participantTypeValues[i].title }
              }
            }
            let totalAudiencePerType = await query(args, ctx)

            totalAudiencePerType = parseInt(totalAudiencePerType, 10)
            if (totalAudiencePerType > 0) {
              if (participantTypeValues[i].title)
                yAxis.push(participantTypeValues[i].title)
              else yAxis.push('None')

              xAxisCount.push(totalAudiencePerType)
              total = total + (totalAudiencePerType)
            }
          }
          break
        }
        case 'Command/Agency': {
          let planParticipantCommandAgencies = await ctx.db.query.planParticipantCommandAgencies()
          for (let i = 0; i < planParticipantCommandAgencies.length; i++) {
            // get audience counts for participantType
            let args = {
              where: {
                commandAgency: { title: planParticipantCommandAgencies[i].title }
              }
            }

            let totalAudiencePerType = await query(args, ctx)
            totalAudiencePerType = parseInt(totalAudiencePerType, 10)
            if (totalAudiencePerType > 0) {
              if (planParticipantCommandAgencies[i].title)
                yAxis.push(planParticipantCommandAgencies[i].title)
              else yAxis.push('None')

              xAxisCount.push(totalAudiencePerType)
              total = total + (totalAudiencePerType)
            }
          }
          break
        }
        case 'Service/Department': {
          let planParticipantServices = await ctx.db.query.planParticipantServices()
          for (let i = 0; i < planParticipantServices.length; i++) {
            // get audience counts for participantType
            let args = {
              where: {
                service: { title: planParticipantServices[i].title }
              }
            }

            let totalAudiencePerType = await query(args, ctx)
            totalAudiencePerType = parseInt(totalAudiencePerType, 10)
            if (totalAudiencePerType > 0) {
              if (planParticipantServices[i].title)
                yAxis.push(planParticipantServices[i].title)
              else yAxis.push('None')

              xAxisCount.push(totalAudiencePerType)
              total = total + (totalAudiencePerType)
            }
          }
          break
        }
        case 'Service/Department Type': {
          let planParticipantServiceTypes = await ctx.db.query.planParticipantServiceTypes()
          for (let i = 0; i < planParticipantServiceTypes.length; i++) {
            // get audience counts for participantType
            let args = {
              where: {
                serviceType: { title: planParticipantServiceTypes[i].title }
              }
            }

            let totalAudiencePerType = await query(args, ctx)
            totalAudiencePerType = parseInt(totalAudiencePerType, 10)
            if (totalAudiencePerType > 0) {
              if (planParticipantServiceTypes[i].title)
                yAxis.push(planParticipantServiceTypes[i].title)
              else yAxis.push('None')

              xAxisCount.push(totalAudiencePerType)
              total = total + (totalAudiencePerType)
            }
          }
          break
        }
        }
        if (total > 0) {
          for (let k = 0; k < xAxisCount.length; k++) {
            xAxisCountDisplay.push(`${xAxisCount[k]} (${((xAxisCount[k] / total) * 100).toFixed(2)}%)`)
          }
        }
        chartData = [
          {
            type: 'bar',
            y: yAxis,
            x: xAxisCount,
            orientation: 'h',
            text: xAxisCountDisplay,
            textposition: 'auto'
          }
        ]
        break
      }
      case 'ParticipantTypePerTOs': {
        let perTrainingObjType = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'Participant Type'
        let sourceType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'Assessment'

        let xAxisCount = []
        let xAxisCountDisplay = []
        let xAxisCountTotal = 0
        switch (perTrainingObjType) {
        case 'Participant Type': {
          // Use list from front-end to avoid conflict
          let participantTypeValues = await ctx.db.query.planParticipantTypes()
          for (let i = 0; i < participantTypeValues.length; i++) {
            // get trainingObjective counts participantType
            let args = {
              where: {
                participant: {
                  participantType: { title: participantTypeValues[i].title }
                }
              }
            }
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              if (participantTypeValues[i].title)
                yAxis.push(participantTypeValues[i].title)
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))
              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }

          break
        }
        case 'Command/Agency': {
          let planParticipantCommandAgencies = await ctx.db.query.planParticipantCommandAgencies()
          for (let i = 0; i < planParticipantCommandAgencies.length; i++) {
            // get trainingObjective counts Command
            let args = {
              where: {
                participant: {
                  commandAgency: { title: planParticipantCommandAgencies[i].title }
                }
              }
            }
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              if (planParticipantCommandAgencies[i].title)
                yAxis.push(planParticipantCommandAgencies[i].title)
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        case 'Service/Department': {
          let planParticipantServices = await ctx.db.query.planParticipantServices()
          for (let i = 0; i < planParticipantServices.length; i++) {
            let args = {
              where: {
                participant: {
                  service: { title: planParticipantServices[i].title }
                }
              }
            }
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              if (planParticipantServices[i].title)
                yAxis.push(planParticipantServices[i].title)
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        case 'Service/Department Type': {
          let planParticipantServiceTypes = await ctx.db.query.planParticipantServiceTypes()
          for (let i = 0; i < planParticipantServiceTypes.length; i++) {
            let args = {
              where: {
                participant: {
                  serviceType: { title: planParticipantServiceTypes[i].title }
                }
              }
            }
            let xAxisData = await helpers.getTraningObjsXAxisData(args, ctx, dateRange, sourceType)
            if (xAxisData.complete > 0 || xAxisData.incomplete > 0) {
              if (planParticipantServiceTypes[i].title)
                yAxis.push(planParticipantServiceTypes[i].title)
              else yAxis.push('None')

              let totalTos = xAxisData.complete + xAxisData.incomplete
              xAxisCount.push(totalTos)
              xAxisCountTotal = xAxisCountTotal + (totalTos)

              xComplete.push((xAxisData.complete / (totalTos)).toFixed(2))
              xIncomplete.push((xAxisData.incomplete / (totalTos)).toFixed(2))

              xDisplayValueComplete.push(`${((xAxisData.complete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.complete} T.O.s`)
              xDisplayValueIncomplete.push(`${((xAxisData.incomplete / (totalTos)) * 100).toFixed(2)}%<br>${xAxisData.incomplete} T.O.s`)
            }
          }
          break
        }
        }
        if (xAxisCountTotal > 0) {
          for (let k = 0; k < xAxisCount.length; k++) {
            xAxisCountDisplay.push(`${xAxisCount[k]} (${((xAxisCount[k] / xAxisCountTotal) * 100).toFixed(2)}%)`)
          }
        }
        let completeDataCount = {
          type: 'bar',
          y: yAxis,
          x: xAxisCount,
          orientation: 'h',
          text: xAxisCountDisplay,
          textposition: 'auto'
        }
        let completeDataPer = {
          x: xComplete,
          y: yAxis,
          text: xDisplayValueComplete,
          ...completeFormat
        }
        let inCompleteDataPer = {
          x: xIncomplete,
          y: yAxis,
          text: xDisplayValueIncomplete,
          ...inCompleteFormat
        }
        // data for second graph
        chartData = [
          inCompleteDataPer,
          completeDataPer,
          completeDataCount
        ]
        total = xAxisCountTotal
        break
      }
      case 'trainingObjectives': {
        let sourceType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'Assessment'
        let query
        if (sourceType === 'Assessment') query = ctx.db.query.planAssessmentsConnection
        else query = ctx.db.query.planEvaluationsConnection

        let completeAssessments = await query(
          {
            where: {
              complete: true,
              ...dateRange
            }
          }, '{aggregate {count}}'
        )
        let inCompleteAssessments = await query(
          {
            where: {
              complete: false,
              ...dateRange
            }
          }, '{aggregate {count}}'
        )
        let totalCompleteAssessments = completeAssessments.aggregate.count
        let totalInCompleteAssessments = inCompleteAssessments.aggregate.count

        chartData = [{
          values: [totalCompleteAssessments, totalInCompleteAssessments],
          labels: ['Complete', 'Incomplete'],
          type: 'pie',
          marker: {
            colors: ['rgb(126,223,126)', 'rgb(243,120,120)']
          }
        }]
        total = (totalCompleteAssessments + totalInCompleteAssessments)
        break
      }
      case 'jepFundingAllocPerParticipant': {
        let yAxisData = []
        let xAxisData = []
        let XAxisLabels = []
        let planParticipants = await ctx.db.query.planParticipants()
        let dataSourceType = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'JEP'
        for (let j = 0; j < planParticipants.length; j++) {
          // Will be extended to other primary sources in future
          let planParticipantFundingSources = await ctx.db.query.planParticipantFundingSources({
            where: {
              primarySource: dataSourceType,
              participant: {
                id: planParticipants[j].id
              }
            }
          }, '{amount}')
          let funding = 0
          for (let i = 0; i < planParticipantFundingSources.length; i++) {
            funding += planParticipantFundingSources[i].amount
          }
          if (funding > 0) {
            xAxisData.push(funding)
            XAxisLabels.push('$' + funding)
            yAxisData.push(planParticipants[j].name)
            total += funding
          }
        }
        let fundingtrace1 = {
          type: 'bar',
          y: yAxisData,
          x: xAxisData,
          orientation: 'h',
          text: XAxisLabels,
          textposition: 'auto',
          marker: {
            color: 'rgba(86,180,233,1)',
            width: 1
          },
        }
        chartData = [fundingtrace1]
        total = total.toFixed(2)
        break
      }
      case 'jepFundingAllocation': {
        let dataSourceType = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'JEP'
        let planFundingSources = await ctx.db.query.planFundingSources({ where: { primarySource: dataSourceType } }, '{subSource amount}')

        let subSources = []
        let SOFParticipantAlloc = []
        let nonSOFParticipantAlloc = []
        let nonAllocatedParticipantAlloc = []
        // percentages
        let SOFParticipantAllocPer = []
        let nonSOFParticipantAllocPer = []
        let nonAllocatedParticipantAllocPer = []

        for (let i = 0; i < planFundingSources.length; i++) {
          let fund = planFundingSources[i]
          // List for Yaxis labels
          subSources.push(fund.subSource + '<br>Total: $' + fund.amount)
          // Calculate SOF, non-SOF and non-allocated funds per funding Sub-source
          let planParticipantFundingSources = await ctx.db.query.planParticipantFundingSources(
            { where: { subSource: fund.subSource } }, '{ subSource amount participant { serviceType { title } } }')

          let nonAllocatedTotal = 0
          let sofTotal = 0
          let nonSofTotal = 0
          for (let i = 0; i < planParticipantFundingSources.length; i++) {
            let participantFund = planParticipantFundingSources[i]
            if (participantFund.participant && participantFund.participant.serviceType && participantFund.participant.serviceType.title) {
              if (participantFund.participant.serviceType.title === 'SOF')
                sofTotal += participantFund.amount
              else nonSofTotal += participantFund.amount
            }
          }
          nonAllocatedTotal = (sofTotal + nonSofTotal)
          nonAllocatedParticipantAlloc.push('$' + (fund.amount - nonAllocatedTotal))
          SOFParticipantAlloc.push('$' + sofTotal)
          nonSOFParticipantAlloc.push('$' + nonSofTotal)

          // SOF, non-SOF and non-allocated percentages
          SOFParticipantAllocPer.push((sofTotal / fund.amount).toFixed(2))
          nonSOFParticipantAllocPer.push((nonSofTotal / fund.amount).toFixed(2))
          nonAllocatedParticipantAllocPer.push(((fund.amount - nonAllocatedTotal) / fund.amount).toFixed(2))

          total += fund.amount
        }

        let sofData = {
          y: subSources,
          x: SOFParticipantAllocPer,
          name: 'SOF',
          text: SOFParticipantAlloc,
          textposition: 'auto',
          marker: {
            color: 'rgba(86,180,233,1)',
            width: 1
          },
          type: 'bar',
          orientation: 'h',
        }
        let nonSofData = {
          y: subSources,
          x: nonSOFParticipantAllocPer,
          name: 'Non-SOF',
          text: nonSOFParticipantAlloc,
          textposition: 'auto',
          type: 'bar',
          marker: {
            color: 'rgba(43,159,120,1)',
            width: 1
          },
          orientation: 'h',
        }
        let nonAllocatedData = {
          y: subSources,
          x: nonAllocatedParticipantAllocPer,
          name: 'Non-Allocated',
          text: nonAllocatedParticipantAlloc,
          textposition: 'auto',
          type: 'bar',
          marker: {
            color: '#E69F00',
            width: 1
          },
          orientation: 'h',
        }
        chartData = [sofData, nonSofData, nonAllocatedData]
        total = total.toFixed(2)
        break
      }
      case 'tpu': {
        let sourceType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'Assessment'
        let query
        if (sourceType === 'Assessment') query = ctx.db.query.planAssessmentsConnection
        else query = ctx.db.query.planEvaluationsConnection
        let untrained = await query(
          {
            where: {
              status: 'UNTRAINED',
              ...dateRange
            }
          }, '{aggregate {count}}'
        )
        let partiallyTrained = await query(
          {
            where: {
              status: 'PARTIALLY',
              ...dateRange
            }
          }, '{aggregate {count}}'
        )
        let trained = await query(
          {
            where: {
              status: 'TRAINED',
              ...dateRange
            }
          }, '{aggregate {count}}'
        )
        let tpuTrainedCount = trained.aggregate.count
        let tpuUnTrainedCount = untrained.aggregate.count

        let tpuPartiallyTrainedCount = partiallyTrained.aggregate.count
        chartData = [{
          x: [tpuTrainedCount],
          y: ['Trained'],
          name: 'Trained',
          orientation: 'h',
          text: [tpuTrainedCount],
          textposition: 'auto',
          marker: {
            color: 'rgb(126,223,126)',
            width: 0.5
          },
          type: 'bar'
        }, {
          x: [tpuPartiallyTrainedCount],
          y: ['Partially Trained'],
          name: 'Partially Trained',
          text: [tpuPartiallyTrainedCount],
          textposition: 'auto',
          orientation: 'h',
          marker: {
            color: 'rgb(240, 228, 66)',
            width: 0.5
          },
          type: 'bar'
        }, {
          x: [tpuUnTrainedCount],
          y: ['Untrained'],
          name: 'Untrained',
          orientation: 'h',
          text: [tpuUnTrainedCount],
          textposition: 'auto',
          marker: {
            color: 'rgb(243,120,120)',
            width: 0.5
          },
          type: 'bar'
        }]
        total = (tpuTrainedCount + tpuUnTrainedCount + tpuPartiallyTrainedCount)
        break
      }
      case 'ineffectiveReasons': {
        let yAxisData = []
        let xAxisData = []
        let XAxisDisplayData = []
        let totalReasons = 0
        let planReasons = await ctx.db.query.planReasons()

        let sourceType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'Assessment'
        let query
        if (sourceType === 'Assessment') query = ctx.db.query.planAssessmentsConnection
        else query = ctx.db.query.planEvaluationsConnection
        for (let i = 0; i < planReasons.length; i++) {
          let trainingObjsWithReason = await query(
            {
              where: {
                reason: {
                  id: planReasons[i].id
                },
                ...dateRange
              }
            }, '{aggregate {count}}'
          )
          // Only show reasons which have assessments assigned on the graph
          if (trainingObjsWithReason.aggregate.count > 0) {
            yAxisData.push(planReasons[i].title)
            totalReasons += trainingObjsWithReason.aggregate.count
            xAxisData.push(trainingObjsWithReason.aggregate.count)
          }
        }
        // Get assessments, incomplete, or complete and either Partially Trained or Untrained, but no reason was selected
        let queryWithoutReason
        if (sourceType === 'Assessment') queryWithoutReason = ctx.db.query.planAssessments
        else queryWithoutReason = ctx.db.query.planEvaluations
        let trainingObjsWithOutReason = await queryWithoutReason(
          {
            where: {
              OR: [
                { complete: false },
                {
                  status_in: [
                    'UNTRAINED',
                    'PARTIALLY'
                  ]
                }
              ],
              ...dateRange
            }
          }, '{id reason{id}}'
        )
        let totalTrainingObjWithoutReason = 0
        for (let k = 0; k < trainingObjsWithOutReason.length; k++) {
          if (trainingObjsWithOutReason[k].reason === null)
            totalTrainingObjWithoutReason++
        }

        if (totalTrainingObjWithoutReason > 0) {
          yAxisData.push('No Reasons')
          totalReasons += totalTrainingObjWithoutReason
          xAxisData.push(totalTrainingObjWithoutReason)
        }

        // Generate data for display
        for (let j = 0; j < xAxisData.length; j++) {
          XAxisDisplayData.push(xAxisData[j] + ' (' + ((xAxisData[j] / totalReasons) * 100).toFixed(0) + '%)')
        }
        chartData = [{
          type: 'bar',
          y: yAxisData,
          x: xAxisData,
          orientation: 'h',
          text: XAxisDisplayData,
          textposition: 'auto'
        }]
        total = totalReasons
        break
      }
      case 'requestedvsplannedTOs': {
        let planTrainingObjectives = await ctx.db.query.planTrainingObjectives({}, '{id requiredRuns injects { id } }')
        let plannedTOs = 0
        for (let j = 0; j < planTrainingObjectives.length; j++) {
          total += parseInt(planTrainingObjectives[j].requiredRuns, 10)
          if (planTrainingObjectives[j].injects)
            plannedTOs += planTrainingObjectives[j].injects.length
        }

        chartData = [{
          values: [total - plannedTOs, plannedTOs],
          labels: ['Requested Remaining', 'Planned'],
          type: 'pie',
          marker: {
            colors: ['#E69F00', 'rgba(43,159,120,1)']
          }
        }]
        break
      }
      case 'totalBudget': {
        let totalFundingData = await ctx.db.query.planFundingSources()
        let allocatedSofFundingData = await ctx.db.query.planParticipantFundingSources({
          where: {
            participant: {
              serviceType: {
                title: 'SOF'
              }
            }
          }
        })
        
        let allocatedNonSofFundingData = await ctx.db.query.planParticipantFundingSources({
          where: {
            OR: [
              {
                participant: {
                  serviceType: null
                }
              },
              {
                participant: {
                  serviceType: {
                    title_not: 'SOF'
                  }
                }
              }
            ]
          }
        })

        let totalFundingSum, allocatedSofFundingSum, allocatedNonSofFundingSum

        if (totalFundingData) {
          totalFundingSum = totalFundingData.reduce((accumulator, currentTotal) => {
            return accumulator + currentTotal.amount
          }, 0)
        }

        if (allocatedSofFundingData) {
          allocatedSofFundingSum = allocatedSofFundingData.reduce((accumulator, currentTotal) => {
            return accumulator + currentTotal.amount
          }, 0)
        }

        if (allocatedNonSofFundingData) {
          allocatedNonSofFundingSum = allocatedNonSofFundingData.reduce((accumulator, currentTotal) => {
            return accumulator + currentTotal.amount
          }, 0)
        }

        let nonAllocatedFunding = totalFundingSum - allocatedSofFundingSum - allocatedNonSofFundingSum
        chartData = [{
          values: [allocatedSofFundingSum, allocatedNonSofFundingSum, nonAllocatedFunding],
          labels: ['SOF','Non-SOF' , 'Non-Allocated'],
          type: 'pie',
          marker: {
            colors: ['rgba(86,180,233,1)','rgba(43,159,120,1)', '#E69F00']
          }
        }]
        total = totalFundingSum
        break
      }  
      case 'plannedVSAssessedTOs': {
        let planTrainingObjectives = await ctx.db.query.planTrainingObjectives({}, '{id injects { id } }')
        let sourceType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'Assessment'
        let query
        if (sourceType === 'Feedback') query = ctx.db.query.planEvaluationsConnection
        else query = ctx.db.query.planAssessmentsConnection

        let planAssessments = await query({}, '{aggregate {count}}')
        let plannedTOs = 0
        let assessedTOs = planAssessments.aggregate.count
        for (let j = 0; j < planTrainingObjectives.length; j++) {
          if (planTrainingObjectives[j].injects)
            plannedTOs += planTrainingObjectives[j].injects.length
        }
        let remaingTOs = (plannedTOs - assessedTOs)
        total = plannedTOs

        chartData = [{
          values: [remaingTOs, assessedTOs],
          labels: ['Planned Remaining', 'Assessed'],
          type: 'pie',
          marker: {
            colors: ['rgba(43,159,120,1)', '#56B4E9']
          }
        }]
        break
      } case 'InjectsCountPerBoard': {
        let labelGroupTitle = args && args.where && args.where.dataSourceType ? args.where.dataSourceType : 'Development'  
        let ownerType = args && args.where && args.where.evaluationType ? args.where.evaluationType : 'All'
        let labelsInBoard = await ctx.db.query.planLabelGroups({ where: { title: labelGroupTitle } }, '{id groupLabels{id title color}}')  
        let xAxisData = []
        let yAxisData = []
        let colorData = []
        let totalPlanInjects = 0
        let argsForInjects = {
          deletedAt: null
        }
        if (ownerType && ownerType != 'All') {
          argsForInjects = {
            ...argsForInjects,
            owner: { title: ownerType }
          }
        }
        for (let j = 0; j < labelsInBoard[0].groupLabels.length; j++) {
          let planInjects = await ctx.db.query.planInjectsConnection({ where: { status: { title: labelsInBoard[0].groupLabels[j].title }, ...argsForInjects } }, '{aggregate {count}}')

          xAxisData.push(labelsInBoard[0].groupLabels[j].title)
          yAxisData.push(planInjects.aggregate.count)
          colorData.push(labelsInBoard[0].groupLabels[j].color)
          totalPlanInjects += planInjects.aggregate.count
        }
        total = totalPlanInjects

        chartData = [
          {
            x: xAxisData,
            y: yAxisData,
            type: 'bar',
            marker: {
              color: colorData
            },
          }
        ]
        break
      }
      }
    }
    return {
      data: chartData,
      total: total
    }

  },
}
module.exports = { planReportQueries }
