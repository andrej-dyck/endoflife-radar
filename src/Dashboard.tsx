import { SVGProps, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Cycle, Cycles, cycleState, CycleState, Product, Products } from './endoflife.date.ts'
import { useProductEolInfo } from './EndOfProductLife.tsx'
import { cn } from './ui-components/cn.tsx'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const Dashboard = ({ products }: { products: Products }) => {
  return <div
    className="grid grid-cols-1 place-content-center justify-items-stretch gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {products.map(p => <ProductCard key={p.productId} product={p} />)}
  </div>
}

const ProductCard = ({ product }: { product: Product }) => {
  const { name, cycles, href, isLoading } = useProductEolInfo(product)
  const systemTime = useMemo(() => new Date(Date.now()), [])

  const iconClass = 'size-6 rounded-full transition-all p-1 hover:ring hover:ring-focus focus:ring focus:ring-focus'

  return <div
    className="flex h-52 flex-col overflow-hidden rounded-xl border border-element-border bg-element-bg px-3 py-2"
  >
    {isLoading ? <SpinnerBars /> : (<>
      <h2 className="line-clamp-1">{name}</h2>
      <div className="grow">
        {cycles && <ProductCycles cycles={cycles} systemTime={systemTime} />}
      </div>
      <div className="flex justify-end gap-1">
        <Link to={`/eol/${product.productId}`}><MagnifyIcon className={iconClass} /></Link>
        {href && <LinkNewTab href={href} iconClass={iconClass} />}
      </div>
    </>)}
  </div>
}

const ProductCycles = ({ cycles, systemTime }: { cycles: Cycles, systemTime: Date }) => {
  return <div className="flex h-full flex-col gap-2 p-2">
    {cycles.slice(0, 3).map((c, i) => (
      <ProductCycle key={c.cycle} cycle={c} isLatest={i === 0} systemTime={systemTime} />
    ))}
  </div>
}

const ProductCycle = ({ cycle, isLatest, systemTime }: { cycle: Cycle, isLatest?: boolean, systemTime: Date }) => {
  const state = useMemo<CycleState>(() => cycleState(cycle)(systemTime), [cycle, systemTime])

  return <span className="inline-flex items-center gap-2">
    <ProductCycleState state={state} />
    <h3 className={cn('line-clamp-1 inline-flex items-center gap-2', !isLatest && 'text-sm font-light')}>
      {cycle.latest ?? cycle.cycle}
      {cycle.codename && <i className="text-sm text-placeholder-text">'{cycle.codename}'</i>}
    </h3>
  </span>
}

const ProductCycleState = ({ state }: { state: CycleState }) => {
  return state.state === 'active-support' && state.isLts ? <StarCheckIcon className="text-amber-300" /> :
    state.state === 'active-support' ? <CheckIcon className="text-green-600" /> :
      state.state === 'security-support' ? <SafetyCheckIcon className="text-orange-600" /> :
        state.state === 'discontinued' ? <ReleaseAlertIcon className="text-orange-600" /> :
          state.state === 'unsupported' ? <StopIcon className="text-red-700" /> :
            <UnknownIcon />
}

/** material-symbols:feature-search-outline */
const MagnifyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m18 13.25l2 2V20q0 .825-.587 1.413T18 22H4q-.825 0-1.412-.587T2 20V6q0-.825.588-1.412T4 4h5.5q-.2.45-.3.963T9.05 6H4v14h14zm1.3-4.35l3.2 3.2l-1.4 1.4l-3.2-3.2q-.525.3-1.125.5T15.5 11q-1.875 0-3.187-1.313T11 6.5q0-1.875 1.313-3.187T15.5 2q1.875 0 3.188 1.313T20 6.5q0 .675-.2 1.275T19.3 8.9m-3.8.1q1.05 0 1.775-.725T18 6.5q0-1.05-.725-1.775T15.5 4q-1.05 0-1.775.725T13 6.5q0 1.05.725 1.775T15.5 9M4 13.25V20V6v7v-.3z"></path>
  </svg>
)

/** material-symbols:check-circle */
const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"></path>
  </svg>
)

/** mdi:star-check */
const StarCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zm12 .2l4.8-4.8l-1.3-1.4l-3.6 3.6l-1.5-1.6l-1.2 1.2z"></path>
  </svg>
)

/** material-symbols:release-alert-rounded */
const ReleaseAlertIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="M8.15 21.75L6.7 19.3l-2.75-.6q-.375-.075-.6-.387t-.175-.688L3.45 14.8l-1.875-2.15q-.25-.275-.25-.65t.25-.65L3.45 9.2l-.275-2.825q-.05-.375.175-.688t.6-.387l2.75-.6l1.45-2.45q.2-.325.55-.438t.7.038l2.6 1.1l2.6-1.1q.35-.15.7-.038t.55.438L17.3 4.7l2.75.6q.375.075.6.388t.175.687L20.55 9.2l1.875 2.15q.25.275.25.65t-.25.65L20.55 14.8l.275 2.825q.05.375-.175.688t-.6.387l-2.75.6l-1.45 2.45q-.2.325-.55.438t-.7-.038l-2.6-1.1l-2.6 1.1q-.35.15-.7.038t-.55-.438M12 17q.425 0 .713-.288T13 16q0-.425-.288-.712T12 15q-.425 0-.712.288T11 16q0 .425.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8v4q0 .425.288.713T12 13"></path>
  </svg>
)

/** material-symbols:safety-check */
const SafetyCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22m0-5q2.075 0 3.538-1.463T17 12q0-2.075-1.463-3.537T12 7Q9.925 7 8.463 8.463T7 12q0 2.075 1.463 3.538T12 17m1.65-2.65L11.5 12.2V9h1v2.8l1.85 1.85z"></path>
  </svg>
)

/** akar-icons:stop-fill */
const StopIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" fillRule="evenodd"
      d="M8 1a1 1 0 0 0-.716.302l-6 6.156A1 1 0 0 0 1 8.156V16a1 1 0 0 0 .293.707l6 6A1 1 0 0 0 8 23h8a1 1 0 0 0 .707-.293l6-6A1 1 0 0 0 23 16V8.156a1 1 0 0 0-.284-.698l-6-6.156A1 1 0 0 0 16 1zm0 10a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
      clipRule="evenodd"></path>
  </svg>
)

/** carbon:unknown-filled */
const UnknownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>
    <path fill="currentColor"
      d="M29.391 14.527L17.473 2.609C17.067 2.203 16.533 2 16 2s-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 24a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m1.125-6.752v1.877h-2.25V15H17c1.034 0 1.875-.841 1.875-1.875S18.034 11.25 17 11.25h-2a1.877 1.877 0 0 0-1.875 1.875v.5h-2.25v-.5A4.13 4.13 0 0 1 15 9h2a4.13 4.13 0 0 1 4.125 4.125a4.13 4.13 0 0 1-4 4.123"></path>
    <path fill="none"
      d="M16 21a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 16 21m1.125-3.752a4.13 4.13 0 0 0 4-4.123A4.13 4.13 0 0 0 17 9h-2a4.13 4.13 0 0 0-4.125 4.125v.5h2.25v-.5c0-1.034.841-1.875 1.875-1.875h2c1.034 0 1.875.841 1.875 1.875S18.034 15 17 15h-2.125v4.125h2.25z"></path>
  </svg>
)
