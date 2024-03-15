import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...cns: ClassValue[]): string =>
  twMerge(clsx(cns))
