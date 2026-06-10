function clampQueryLimit(value, options = {}) {
  const min = options.min || 1
  const max = options.max || 300
  const defaultValue = options.defaultValue || 100
  const requested = Number(value || defaultValue)

  if (!Number.isFinite(requested)) {
    return defaultValue
  }

  return Math.min(Math.max(Math.floor(requested), min), max)
}

function asValidDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function dateRangeWhere(fields, start, end) {
  const startDate = asValidDate(start)
  const endDate = asValidDate(end)
  if (!startDate && !endDate) return null

  const range = {}
  if (startDate) range.gte = startDate
  if (endDate) range.lte = endDate

  return {
    OR: fields.map(field => ({
      [field]: range
    }))
  }
}

function mergeWhere(...conditions) {
  const filtered = conditions.filter(Boolean)
  if (filtered.length === 0) return undefined
  if (filtered.length === 1) return filtered[0]
  return {
    AND: filtered
  }
}

module.exports = {
  clampQueryLimit,
  dateRangeWhere,
  mergeWhere
}
