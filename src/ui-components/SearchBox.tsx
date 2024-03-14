import { useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { SearchIcon } from '../icons/SearchIcon.tsx'
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
