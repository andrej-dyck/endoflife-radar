import { SVGProps, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { onEsc, stopPropagation } from './input-events.ts'

export const SearchBox = ({ label, placeholder, formClassName, onChange, onFocusChange }: {
  label: string,
  placeholder?: string,
  formClassName?: string,
  onChange: (input: string) => void
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  const [value, setValue] = useState('')
  const changeValue = (v: string) => {
    setValue(v)
    onChange(v.trim())
  }

  const ref = useRef<HTMLInputElement>(null)

  useHotkeys('ctrl+k', () => ref.current?.focus(), { preventDefault: true })

  return <form className={formClassName} onSubmit={stopPropagation}>
    <div className="flex">
      <label htmlFor="search" className="sr-only mb-2 text-sm font-medium">{label}</label>
      <div className="relative w-full">
        <input type="search" id="search" ref={ref}
          className="block w-full rounded-lg border border-element-border bg-element-bg p-2 transition-all placeholder:text-placeholder-text hover:ring hover:ring-focus focus:border-focus focus:ring focus:ring-focus"
          value={value}
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          onKeyDown={onEsc(() => value ? changeValue('') : ref.current?.blur())}
        />
        <div
          className="absolute end-0 top-0 flex h-full flex-col place-content-center rounded-e-lg border border-primary-element bg-primary-element p-2 transition-all focus:ring-4  focus:ring-focus"
        >
          <SearchIcon className="size-5" />
          <span className="sr-only">Search</span>
        </div>
      </div>
    </div>
  </form>
}

/** material-symbols:search */
const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"></path>
  </svg>
)
