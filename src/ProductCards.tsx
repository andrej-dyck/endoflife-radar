import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router'
import { match } from 'ts-pattern'
import { type Product, type ProductRelease, supportState, type SupportState } from './apiEndoflifeDate.ts'
import { daysInMs, useProductEolInfo } from './EndOfProductLife.tsx'
import { IconButton } from './ui-components/IconButton.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'
import { ExternalLinkIcon, TextLink } from './ui-components/TextLink.tsx'
import { cns } from './ui-components/twMerge.tsx'
import { withSvgProps } from './ui-components/withSvgProps.tsx'

export const ProductCards = ({ products, onRemove }: {
  products: readonly Pick<Product, 'productId'>[],
  onRemove?: (p: Pick<Product, 'productId'>) => void,
}) =>
  <div
    className="grid grid-cols-1 place-content-center justify-items-stretch gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 transition-all transition-discrete"
  >
    {products.map(p => <ProductCard key={p.productId} product={p} onRemove={onRemove} />)}
  </div>

const ProductCard = ({ product: { productId }, onRemove }: {
  product: Pick<Product, 'productId'>,
  onRemove?: (p: Pick<Product, 'productId'>) => void,
}) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const { product, isLoading } = useProductEolInfo({ productId }, { refreshIntervalInMs: daysInMs(1), load: inView })

  return <div ref={ref}
    className="flex h-52 flex-col overflow-hidden rounded-xl border border-element-border bg-element-bg px-3 py-2"
  >
    {isLoading ? <SpinnerBars /> : <>
      <div className="flex place-content-between items-baseline">
        <h2 className="line-clamp-1">{product?.label ?? productId}</h2>
        {onRemove && <IconButton onClick={() => onRemove({ productId })} icon={<RemoveIcon />} />}
      </div>
      <div className="grow">
        {product?.releases && <ProductReleases releases={product.releases} />}
      </div>
      <div className="flex justify-end gap-1">
        <Link to={`/eol/${productId}`}><IconButton icon={<ProductDataIcon />} /></Link>
        {product?.links &&
          <TextLink href={product.links.html} external><IconButton icon={<ExternalLinkIcon />} /></TextLink>}
      </div>
    </>}
  </div>
}

const ProductReleases = ({ releases }: { releases: readonly ProductRelease[] }) =>
  <div className="flex h-full flex-col gap-2 p-2">
    {releases
      .slice(0, 3)
      .map((r, i) => <ProductCycle key={r.name} release={r} isLatest={i === 0} />)
    }
  </div>

const ProductCycle = ({ release, isLatest }: { release: ProductRelease, isLatest?: boolean }) => {
  const state = supportState(release)

  return <span className="inline-flex items-center gap-2">
    <SupportState state={state} />
    <h3 className={cns('line-clamp-1 inline-flex items-center gap-2', !isLatest && 'text-sm font-light')}>
      {release.latest?.name ?? release.name}
      {release.codename && <i className="text-sm text-placeholder-text">'{release.codename}'</i>}
    </h3>
  </span>
}

const SupportState = ({ state }: { state: SupportState }) =>
  match(state)
    .with({ state: 'active-support', isLts: true }, () => <StarCheckIcon className="text-amber-300" />)
    .with({ state: 'active-support', isLts: false }, () => <CheckIcon className="text-green-600" />)
    .with({ state: 'extended-support' }, () => <SafetyCheckIcon className="text-orange-600" />)
    .with({ state: 'discontinued' }, () => <ReleaseAlertIcon className="text-orange-600" />)
    .with({ state: 'unsupported' }, () => <StopIcon className="text-red-700" />)
    .otherwise(() => <UnknownIcon />)

/** lucide:x */
const RemoveIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M18 6L6 18M6 6l12 12" />
  </svg>
)

/** lucide:search-code */
const ProductDataIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m13 13.5l2-2.5l-2-2.5M21 21l-4.3-4.3M9 8.5L7 11l2 2.5" />
      <circle cx="11" cy="11" r="8" />
    </g>
  </svg>
)

/** material-symbols:check-circle */
const CheckIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"></path>
  </svg>
)

/** mdi:star-check */
const StarCheckIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zm12 .2l4.8-4.8l-1.3-1.4l-3.6 3.6l-1.5-1.6l-1.2 1.2z"></path>
  </svg>
)

/** material-symbols:release-alert-rounded */
const ReleaseAlertIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="M8.15 21.75L6.7 19.3l-2.75-.6q-.375-.075-.6-.387t-.175-.688L3.45 14.8l-1.875-2.15q-.25-.275-.25-.65t.25-.65L3.45 9.2l-.275-2.825q-.05-.375.175-.688t.6-.387l2.75-.6l1.45-2.45q.2-.325.55-.438t.7.038l2.6 1.1l2.6-1.1q.35-.15.7-.038t.55.438L17.3 4.7l2.75.6q.375.075.6.388t.175.687L20.55 9.2l1.875 2.15q.25.275.25.65t-.25.65L20.55 14.8l.275 2.825q.05.375-.175.688t-.6.387l-2.75.6l-1.45 2.45q-.2.325-.55.438t-.7-.038l-2.6-1.1l-2.6 1.1q-.35.15-.7.038t-.55-.438M12 17q.425 0 .713-.288T13 16q0-.425-.288-.712T12 15q-.425 0-.712.288T11 16q0 .425.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8v4q0 .425.288.713T12 13"></path>
  </svg>
)

/** material-symbols:safety-check */
const SafetyCheckIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22m0-5q2.075 0 3.538-1.463T17 12q0-2.075-1.463-3.537T12 7Q9.925 7 8.463 8.463T7 12q0 2.075 1.463 3.538T12 17m1.65-2.65L11.5 12.2V9h1v2.8l1.85 1.85z"></path>
  </svg>
)

/** akar-icons:stop-fill */
const StopIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" fillRule="evenodd"
      d="M8 1a1 1 0 0 0-.716.302l-6 6.156A1 1 0 0 0 1 8.156V16a1 1 0 0 0 .293.707l6 6A1 1 0 0 0 8 23h8a1 1 0 0 0 .707-.293l6-6A1 1 0 0 0 23 16V8.156a1 1 0 0 0-.284-.698l-6-6.156A1 1 0 0 0 16 1zm0 10a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
      clipRule="evenodd"></path>
  </svg>
)

/** carbon:unknown-filled */
const UnknownIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>
    <path fill="currentColor"
      d="M29.391 14.527L17.473 2.609C17.067 2.203 16.533 2 16 2s-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 24a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m1.125-6.752v1.877h-2.25V15H17c1.034 0 1.875-.841 1.875-1.875S18.034 11.25 17 11.25h-2a1.877 1.877 0 0 0-1.875 1.875v.5h-2.25v-.5A4.13 4.13 0 0 1 15 9h2a4.13 4.13 0 0 1 4.125 4.125a4.13 4.13 0 0 1-4 4.123"></path>
    <path fill="none"
      d="M16 21a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 16 21m1.125-3.752a4.13 4.13 0 0 0 4-4.123A4.13 4.13 0 0 0 17 9h-2a4.13 4.13 0 0 0-4.125 4.125v.5h2.25v-.5c0-1.034.841-1.875 1.875-1.875h2c1.034 0 1.875.841 1.875 1.875S18.034 15 17 15h-2.125v4.125h2.25z"></path>
  </svg>
)
