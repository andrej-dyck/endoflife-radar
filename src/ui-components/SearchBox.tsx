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
          className="block w-full rounded-lg border border-gray-500 bg-gray-700 p-2 placeholder:text-gray-400 focus:border-sky-700 focus:ring-sky-700"
          value={value}
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          onKeyDown={onEsc(() => value ? changeValue('') : ref.current?.blur())}
        />
        <div
          className="absolute end-0 top-0 flex h-full flex-col place-content-center rounded-e-lg border border-sky-700 bg-sky-700 p-2 hover:bg-sky-700 focus:ring-4 focus:ring-sky-700"
        >
          <SearchIcon className="size-5" />
          <span className="sr-only">Search</span>
        </div>
      </div>
    </div>
  </form>
}

