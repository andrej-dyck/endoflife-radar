import React from 'react'
import { SearchIcon } from '../icons/SearchIcon.tsx'

export const SearchBox = ({ label, placeholder, formClassName, onChange }: {
  label: string,
  placeholder?: string,
  formClassName?: string,
  onChange: (input: string) => void
}) => {
  return <form className={formClassName} onSubmit={stopPropagation}>
    <div className="flex">
      <label htmlFor="search" className="sr-only mb-2 text-sm font-medium">{label}</label>
      <div className="relative w-full">
        <input type="search" id="search"
          className="block w-full rounded-lg border border-gray-500 bg-gray-700 p-2 placeholder:text-gray-400 focus:border-sky-700 focus:ring-sky-700"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.trim())}
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

const stopPropagation = (event: React.SyntheticEvent) => {
  event.preventDefault()
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()
}
