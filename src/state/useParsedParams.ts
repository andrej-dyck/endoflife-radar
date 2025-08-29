import { useParams } from 'react-router'
import { z } from 'zod/mini'

export const useParsedParams = <T extends z.ZodMiniObject>(schema: T): z.output<T> =>
  schema.parse(useParams())
