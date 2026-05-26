const Inject = {
  async createPlanInject(parent, args, ctx, info) {
    // Get total number of injects for workspace
    let injectsTotal = await ctx.db.query.planInjectsConnection(
      {},
      '{aggregate {count}}'
    )
    // Assign next available number in seq to inject.number
    let number = injectsTotal.aggregate.count + 1
    args.data = {
      ...args.data,
      number
    }
    return ctx.db.mutation.createPlanInject(args, info)
  },
  async deletePlanInject(parent, args, ctx, info) {
    var dateNow = new Date()
    var dateISO = dateNow.toISOString()

    let deleteInjectArgs = {
      data: {
        deletedAt: dateISO
      },
      where: { id: args.where.id }
    }
    return ctx.db.mutation.updatePlanInject(deleteInjectArgs, info)
  },
  async duplicatePlanInject(parent, args, ctx, info) {
    let inject = await ctx.db.query.planInject(args, `{ id title location { geojson geohash } description mitigation type method { id } number owner { id } trigger response responseDate 
        remarks status { id } attachments { name size createTime updateTime contentType url } deletedAt createdAt 
        updatedAt events { id } startDate from to objectives { id }}`)
    let injectsTotal = await ctx.db.query.planInjectsConnection(
      {},
      '{aggregate {count}}'
    )

    let finalInjectData = {
      title: inject.title,
      description: inject.description,
      mitigation: inject.mitigation,
      type: inject.type,
      trigger: inject.trigger,
      response: inject.response,
      responseDate: inject.responseDate,
      remarks: inject.remarks,
      deletedAt: inject.deletedAt,
      startDate: inject.startDate,
      from: inject.from,
      to: inject.to
    }

    if (inject.location)
      finalInjectData = {
        ...finalInjectData,
        location: {
          create: inject.location
        }
      }

    if (inject.status)
      finalInjectData = {
        ...finalInjectData,
        status: {
          connect: inject.status
        }
      }

    if (inject.owner)
      finalInjectData = {
        ...finalInjectData,
        owner: {
          connect: inject.owner
        }
      }

    if (inject.method)
      finalInjectData = {
        ...finalInjectData,
        method: {
          connect: inject.method
        }
      }

    if (inject.events)
      finalInjectData = {
        ...finalInjectData,
        events: {
          connect: inject.events
        }
      }

    if (
      inject.attachments &&
      inject.attachments.length > 0
    ) {
      finalInjectData = {
        ...finalInjectData,
        attachments: {
          create: inject.attachments
        }
      }
    }

    if (
      inject.objectives &&
      inject.objectives.length > 0
    ) {
      finalInjectData = {
        ...finalInjectData,
        objectives: {
          connect: inject.objectives
        }
      }
    }
    // Assign next available number in seq to inject.number        
    finalInjectData = {
      ...finalInjectData,
      number: injectsTotal.aggregate.count + 1
    }

    return await ctx.db.mutation.createPlanInject({ data: finalInjectData }, info)
  }
}

module.exports = { Inject }
