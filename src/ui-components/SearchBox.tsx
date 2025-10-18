import { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { onEnter, onEsc, pipeEvents, stopPropagation } from './input-events.ts'
import { cns } from './twMerge.tsx'
import { withSvgProps } from './withSvgProps.tsx'

export const SearchBox = ({ value: initialValue, label, placeholder, formClassName, hotkey, onChange, onFocusChange }: {
  value?: string,
  label: string,
  placeholder?: string,
  formClassName?: string,
  hotkey?: string,
  onChange: (input: string) => void
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  const [inputValue, setInputValue] = useState(initialValue ?? '')

  const changeValue = (v: string) => {
    setInputValue(v)
    onChange(v.trim())
  }

  useEffect(() => {
    if (initialValue !== inputValue) setInputValue(initialValue ?? '')
  }, [initialValue]) // only listen to parameter value changes

  const ref = useRef<HTMLInputElement>(null)

  useHotkeys(hotkey ?? '', () => ref.current?.focus(), { enabled: hotkey != null, preventDefault: true })

  return <form className={formClassName} onSubmit={stopPropagation}>
    <div className="flex">
      <label htmlFor="search" className="sr-only mb-2 text-sm font-medium">{label}</label>
      <div className="relative w-full">
        <input type="search" id="search" ref={ref}
          className="block w-full rounded-lg border border-element-border bg-element-bg p-2 transition-all placeholder:text-placeholder-text hover:ring hover:ring-focus focus:border-focus focus:ring focus:ring-focus"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          onKeyDown={pipeEvents(
            onEnter(() => { /* do nothing */ }),
            onEsc(() => inputValue ? changeValue('') : ref.current?.blur())
          )}
        />
        <button
          className={cns('absolute end-0 top-0 flex h-full flex-col place-content-center rounded-e-lg border border-primary-element bg-primary-element p-2 transition-all focus:ring-4 focus:ring-focus', inputValue && 'cursor-pointer')}
          disabled={!inputValue}
          onClick={() => changeValue('')}
        >
          {!inputValue
            ? <SearchIcon className="size-5" />
            : <><ClearIcon className="size-5" /><span className="sr-only">clear</span></>}
        </button>
      </div>
    </div>
  </form>
}

/** lucide:search */
const SearchIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m21 21l-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </g>
  </svg>
)

/** lucide:x */
const ClearIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M18 6L6 18M6 6l12 12" />
  </svg>
)
