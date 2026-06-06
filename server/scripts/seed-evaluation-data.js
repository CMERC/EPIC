const { Prisma } = require('prisma-binding')

const endpoint = process.env.PRISMA_ENDPOINT || 'http://localhost:4466/default/default'
const secret = process.env.PRISMA_SECRET

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint,
  secret,
  debug: false
})

const first = async(promise, fallback = null) => {
  const values = await promise
  return values && values.length > 0 ? values[0] : fallback
}

const getOrCreate = async({ query, create, name }) => {
  const existing = await query()
  if (existing) {
    return existing
  }

  const created = await create()
  console.log(`created ${name}: ${created.id || created.name || created.title}`)
  return created
}

const ensureReferenceSeed = async() => {
  const app = await first(db.query.appListSettings({ where: { name: 'PLAN' } }, '{ id name }'))
  const method = await first(db.query.planMethods({ where: { name: 'Email' } }, '{ id name }'))
  const social = await first(db.query.mediaServices({ where: { name: 'twitter' } }, '{ id name }'))

  if (app && method && social) {
    return
  }

  throw new Error(
    'Reference data is missing. Run `cd database && npx prisma1 seed` before seeding evaluation data.'
  )
}

const ensureChat = async() => {
  const room = await getOrCreate({
    name: 'chat room operations',
    query: () => first(db.query.chatRooms({ where: { title: 'operations' } }, '{ id title }')),
    create: () => db.mutation.createChatRoom({ data: { title: 'operations' } }, '{ id title }')
  })

  const existingMessage = await first(
    db.query.chatMessages(
      { where: { text_contains: 'Evaluation room is online', room: { id: room.id } } },
      '{ id }'
    )
  )

  if (!existingMessage) {
    await db.mutation.createChatMessage({
      data: {
        text: 'Evaluation room is online. Use this thread to test room switching and message posting.',
        author: 'EPIC Seeder',
        room: { connect: { id: room.id } }
      }
    }, '{ id }')
    console.log('created chat message: operations welcome')
  }
}

const ensurePlan = async() => {
  const organization = await first(db.query.planOrganizations({ first: 1 }, '{ id name }'))
  const methodEmail = await first(db.query.planMethods({ where: { name: 'Email' } }, '{ id name }'))
  const methodMedia = await first(db.query.planMethods({ where: { name: 'Media' } }, '{ id name }'))
  const statusScheduled = await first(db.query.planLabels({ where: { title: 'Scheduled' } }, '{ id title }'))
  const statusDraft = await first(db.query.planLabels({ where: { title: 'Draft' } }, '{ id title }'))
  const serviceType = await first(db.query.planParticipantServiceTypes({ first: 1 }, '{ id title }'))
  const service = await first(db.query.planParticipantServices({ first: 1 }, '{ id title }'))
  const commandAgency = await first(db.query.planParticipantCommandAgencies({ first: 1 }, '{ id title }'))
  const participantType = await first(db.query.planParticipantTypes({ first: 1 }, '{ id title }'))
  const jmet = await first(db.query.planJmets({ first: 1 }, '{ id taskTitle }'))
  const priority = await first(db.query.planPriorityLevels({ first: 1 }, '{ id title color }'))
  const requested = await first(db.query.planRequestedMethodTypes({ first: 1 }, '{ id title }'))
  const trained = await first(db.query.planTrainedMethodTypes({ first: 1 }, '{ id title }'))

  const event = await getOrCreate({
    name: 'plan event evaluation exercise',
    query: () => first(db.query.planEvents({ where: { name: 'Evaluation Exercise 2026' } }, '{ id name }')),
    create: () => db.mutation.createPlanEvent({
      data: {
        name: 'Evaluation Exercise 2026',
        type: 'Exercise',
        method: 'Distributed',
        startDate: '2026-06-01T13:00:00.000Z',
        endDate: '2026-06-05T21:00:00.000Z',
        color: '#2f80ed',
        description: 'Seeded scenario for evaluating plan, inject, participant, and assessment workflows.',
        exerciseGuidance: 'Validate that planners can create events, participants, objectives, and injects.',
        ...(organization ? { organization: { connect: { id: organization.id } } } : {})
      }
    }, '{ id name }')
  })

  const participant = await getOrCreate({
    name: 'plan participant evaluation cell',
    query: () => first(db.query.planParticipants({ where: { name: 'Evaluation Response Cell' } }, '{ id name }')),
    create: () => db.mutation.createPlanParticipant({
      data: {
        name: 'Evaluation Response Cell',
        homeStation: 'Training Site Alpha',
        bedDown: 'Forward Operating Location',
        totalAudience: '42',
        icon: 'fas fa-users',
        ...(serviceType ? { serviceType: { connect: { id: serviceType.id } } } : {}),
        ...(service ? { service: { connect: { id: service.id } } } : {}),
        ...(commandAgency ? { commandAgency: { connect: { id: commandAgency.id } } } : {}),
        ...(participantType ? { participantType: { connect: { id: participantType.id } } } : {})
      }
    }, '{ id name }')
  })

  await getOrCreate({
    name: 'plan training objective evaluation',
    query: () => first(db.query.planTrainingObjectives({ where: { task: 'Validate cross-functional coordination' } }, '{ id task }')),
    create: () => db.mutation.createPlanTrainingObjective({
      data: {
        task: 'Validate cross-functional coordination',
        condition: 'Given a compressed operational timeline and incomplete reports.',
        standard: 'Coordinate response actions and publish a complete situation update within 30 minutes.',
        requiredRuns: '2',
        classification: 'UNCLASSIFIED',
        requestedMethod: { method: 'Live' },
        trainedMethod: { method: 'Tabletop' },
        priority: { level: 'High' },
        participant: { connect: { id: participant.id } },
        ...(jmet ? { jmet: { connect: { id: jmet.id } } } : {}),
        ...(priority ? { priorityLevel: { connect: { id: priority.id } } } : {}),
        ...(requested ? { requestedMethodType: { connect: { id: requested.id } } } : {}),
        ...(trained ? { trainedMethodType: { connect: { id: trained.id } } } : {})
      }
    }, '{ id task }')
  })

  const injects = [
    {
      number: 9001,
      title: 'Initial Situation Report',
      description: 'Seeded inject for testing plan preparation, status, and timeline views.',
      trigger: 'Exercise start',
      response: 'Publish initial coordination update.',
      method: methodEmail,
      status: statusScheduled,
      startDate: '2026-06-01T14:00:00.000Z'
    },
    {
      number: 9002,
      title: 'Public Media Escalation',
      description: 'Seeded inject connected to the media app evaluation content.',
      trigger: 'Simulated media post begins trending.',
      response: 'Coordinate public information and operational response.',
      method: methodMedia || methodEmail,
      status: statusDraft,
      startDate: '2026-06-02T16:30:00.000Z'
    }
  ]

  for (const inject of injects) {
    await getOrCreate({
      name: `plan inject ${inject.number}`,
      query: () => db.query.planInject({ where: { number: inject.number } }, '{ id number title }').catch(() => null),
      create: () => db.mutation.createPlanInject({
        data: {
          number: inject.number,
          title: inject.title,
          description: inject.description,
          trigger: inject.trigger,
          response: inject.response,
          startDate: inject.startDate,
          events: { connect: { id: event.id } },
          ...(inject.method ? { method: { connect: { id: inject.method.id } } } : {}),
          ...(inject.status ? { status: { connect: { id: inject.status.id } } } : {})
        }
      }, '{ id number title }')
    })
  }
}

const ensureMedia = async() => {
  const service = await getOrCreate({
    name: 'media service evaluation news',
    query: () => first(db.query.mediaServices({ where: { name: 'evaluation-news' } }, '{ id name displayName }')),
    create: () => db.mutation.createMediaService({
      data: {
        name: 'evaluation-news',
        displayName: 'Evaluation News',
        type: 'NEWS',
        icon: 'fas fa-newspaper',
        color: '#1f7a8c',
        description: 'Seeded site for evaluating media profiles and posts.'
      }
    }, '{ id name displayName }')
  })

  const profile = await getOrCreate({
    name: 'media profile eval observer',
    query: () => first(db.query.mediaProfiles({ where: { username: 'eval_observer' } }, '{ id username name }')),
    create: () => db.mutation.createMediaProfile({
      data: {
        service: { connect: { id: service.id } },
        username: 'eval_observer',
        name: 'Evaluation Observer',
        description: 'Seeded account for media workflow evaluation.',
        url: 'https://example.invalid/evaluation-news/eval_observer',
        isUserGenerated: false,
        language: 'en',
        counts: { followers: 1240, following: 86, posts: 3 }
      }
    }, '{ id username name }')
  })

  await getOrCreate({
    name: 'media post evaluation sitrep',
    query: () => first(db.query.mediaPosts({ where: { title: 'Evaluation Exercise Situation Update' } }, '{ id title }')),
    create: () => db.mutation.createMediaPost({
      data: {
        title: 'Evaluation Exercise Situation Update',
        text: 'Training audiences are responding to a simulated public information spike during Evaluation Exercise 2026.',
        isPublished: true,
        isUserGenerated: false,
        createTime: '2026-06-02T16:00:00.000Z',
        publishTime: '2026-06-02T16:05:00.000Z',
        url: 'https://example.invalid/evaluation-news/posts/situation-update',
        counts: { likes: 42, shares: 11, comments: 6 },
        profiles: { connect: [{ id: profile.id }] }
      }
    }, '{ id title }')
  })

  const persona = await getOrCreate({
    name: 'media persona exercise public',
    query: () => first(db.query.mediaPersonae({ where: { name: 'Exercise Public Voice' } }, '{ id name }')),
    create: () => db.mutation.createMediaPersona({
      data: {
        name: 'Exercise Public Voice',
        role: 'Observer',
        description: 'Seeded persona with an attached profile for testing persona/profile workflows.',
        profiles: { connect: [{ id: profile.id }] }
      }
    }, '{ id name }')
  })

  await getOrCreate({
    name: 'media network evaluation network',
    query: () => first(db.query.mediaNetworks({ where: { name: 'Evaluation Media Network' } }, '{ id name }')),
    create: () => db.mutation.createMediaNetwork({
      data: {
        name: 'Evaluation Media Network',
        description: 'Seeded network for testing media graph views.',
        personas: { connect: [{ id: persona.id }] }
      }
    }, '{ id name }')
  })
}

const main = async() => {
  await ensureReferenceSeed()
  await ensureChat()
  await ensurePlan()
  await ensureMedia()
  console.log('Evaluation data seed complete.')
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
