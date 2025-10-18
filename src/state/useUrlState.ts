import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

export const useUrlState = <TState>(
  key: string,
  { initial, parse, serialize }: Transformation<TState>,
  options?: { replaceHistory?: boolean }
): readonly [TState, Dispatch<SetStateAction<TState>>] => {
  const [state, setState] = useState<TState>(initial)

  const [urlSearchParams, setUrlSearchParams] = useSearchParams()

  useEffect(() => {
    const paramValue = urlSearchParams.get(key)
    if (paramValue != null) setState(parse(paramValue))
  }, [urlSearchParams])

  const setUrlState: Dispatch<SetStateAction<TState>> = (action) => {
    const newState = action instanceof Function ? action(state) : action

    setState(newState)
    setUrlSearchParams(urlSearchParams => {
      if (newState == false) urlSearchParams.delete(key)
      else urlSearchParams.set(key, serialize(newState))

      return urlSearchParams
    }, {
      replace: options?.replaceHistory ?? true,
    })
  }

  return [state, setUrlState]
}

export type Transformation<TState> = {
  initial: TState
  parse: (s: string) => TState
  serialize: (s: TState) => string
}

export const pString = (init?: { initial: string }): Transformation<string> => ({
  initial: init?.initial ?? '',
  parse: (s) => s,
  serialize: (s) => s,
})

export const pStrings = (init?: { initial: readonly string[] }): Transformation<readonly string[]> => ({
  initial: init?.initial ?? [],
  parse: (s) => s.split(','),
  serialize: (s) => s.join(','),
})
