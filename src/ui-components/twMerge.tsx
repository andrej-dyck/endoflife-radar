import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cns = (...cns: ClassValue[]): string =>
  twMerge(clsx(cns))
