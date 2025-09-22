export const isEveryValueNullish = (obj: Record<PropertyKey, unknown>) =>
  Object.values(obj).every(v => v == null)

export const omitNullishValues = <T extends Record<PropertyKey, unknown>>(obj: T): T => {
  if (Object.keys(obj).length === 0) return obj

  const copy: T = { ...obj }
  Object.entries(obj).forEach(([key, value]) => {
    if (value == null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete copy[key]
    }
  })

  return copy
}
