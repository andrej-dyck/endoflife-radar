import React from 'react'

type InputEventHandler = React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
type InputEventOptions = { enabled: boolean }

export const onEnter = (callback: InputEventHandler, options?: InputEventOptions) =>
  onExactKey('Enter', callback, options)

export const onEsc = (callback: InputEventHandler, options?: InputEventOptions) =>
  onExactKey('Escape', callback, options)

const onExactKey = (code: string, callback: InputEventHandler, options?: InputEventOptions): InputEventHandler =>
  (event) => {
    if (event.isPropagationStopped() || options?.enabled === false) return
    if (event.key === code && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      stopPropagation(event)
      callback(event)
    }
  }

export const pipeEvents = (...handle: readonly InputEventHandler[]): InputEventHandler =>
  (event) => handle.forEach(h => h(event))

export const stopPropagation = (event: React.SyntheticEvent) => {
  event.preventDefault()
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()
}
