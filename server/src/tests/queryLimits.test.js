const { clampQueryLimit, dateRangeWhere, mergeWhere } = require('../services/queryLimits')

test('clampQueryLimit applies defaults and caps oversized requests', () => {
  expect(clampQueryLimit(undefined, {
    defaultValue: 25,
    max: 50
  })).toBe(25)
  expect(clampQueryLimit(5000, {
    defaultValue: 25,
    max: 50
  })).toBe(50)
  expect(clampQueryLimit(-10, {
    defaultValue: 25,
    max: 50
  })).toBe(1)
})

test('dateRangeWhere builds a Prisma OR range across date fields', () => {
  const where = dateRangeWhere(
    ['createdAt', 'sentAt'],
    '2026-06-09T00:00:00Z',
    '2026-06-10T00:00:00Z'
  )

  expect(where).toEqual({
    OR: [
      {
        createdAt: {
          gte: new Date('2026-06-09T00:00:00Z'),
          lte: new Date('2026-06-10T00:00:00Z')
        }
      },
      {
        sentAt: {
          gte: new Date('2026-06-09T00:00:00Z'),
          lte: new Date('2026-06-10T00:00:00Z')
        }
      }
    ]
  })
})

test('mergeWhere preserves a single condition and combines multiple conditions', () => {
  expect(mergeWhere(null, {
    deletedAt: null
  })).toEqual({
    deletedAt: null
  })

  expect(mergeWhere({
    deletedAt: null
  }, {
    OR: [{ createdAt: { gte: new Date('2026-06-09T00:00:00Z') } }]
  })).toEqual({
    AND: [
      {
        deletedAt: null
      },
      {
        OR: [{ createdAt: { gte: new Date('2026-06-09T00:00:00Z') } }]
      }
    ]
  })
})
