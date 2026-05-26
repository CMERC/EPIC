function planInjectArgs(args) {
  let searchQuery, searchEvent

  if (args.event) {
    searchEvent = {
      AND: [
        {
          events: {
            name_contains: args.event
          }
        }
      ]
    }
  }

  if (args.query) {
    searchQuery =
      [
        { id_contains: args.query },
        { title_contains: args.query },
        { description_contains: args.query },
        { type_contains: args.query },
        { method: { name_contains: args.query } },
        { owner: { title_contains: args.query } },
        { trigger_contains: args.query },
        { response_contains: args.query },
        { remarks_contains: args.query },
        { from_contains: args.query },
        { to_contains: args.query },
        {
          objectives_some: {
            OR: [
              {
                jmet: {
                  OR: [
                    { levelWar_contains: args.query },
                    { taskNumber_contains: args.query },
                    { taskTitle_contains: args.query }
                  ]
                }
              },
              {
                exerciseObjective_some: {
                  OR: [
                    { title_contains: args.query },
                    { exerciseObjective_contains: args.query },
                    { measurePerformance_contains: args.query },
                    { measureEffectiveness_contains: args.query },
                  ]
                }
              },
              {
                accreditedTask_some: {
                  OR: [
                    {
                      jmet: {
                        OR: [
                          { levelWar_contains: args.query },
                          { taskNumber_contains: args.query },
                          { taskTitle_contains: args.query }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                commandTrainingPriority_some: {
                  OR: [
                    { title_contains: args.query },
                    { description_contains: args.query }
                  ]
                }
              },
              { requiredRuns_contains: args.query },
              { classification_contains: args.query },
              { task_contains: args.query },
              { condition_contains: args.query },
              { standard_contains: args.query },
            ]
          }
        },
        {
          status: {
            OR: [
              { title_contains: args.query },
              { description_contains: args.query },
            ]
          }
        },
        {
          events: {
            OR: [
              { name_contains: args.query },
              { type_contains: args.query },
              { method_contains: args.query },
              { exerciseGuidance_contains: args.query },
              { description_contains: args.query },
            ]
          }
        }

      ]

    // If number add number to searchQuery
    if (!isNaN(args.query)) {
      searchQuery.push({ number: parseInt(args.query) })

    }
  }

  return {
    where: {
      deletedAt: null,
      ...searchEvent,
      OR: searchQuery,
    }
  }
}

module.exports.planInjectArgs = planInjectArgs
