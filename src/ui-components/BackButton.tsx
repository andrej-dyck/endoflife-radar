import { useNavigate } from 'react-router'
import { cns } from './twMerge.tsx'
import { withSvgProps } from './withSvgProps.tsx'

export const BackButton = ({ className }: { className?: string }) => {

  const navigate = useNavigate()
  return <button
    aria-label="Navigate back"
    onClick={() => history.length <= 2 ? void navigate('..', { relative: 'route' }) : history.back()}
    className={cns(className, 'flex items-center gap-1.5', 'rounded-full transition-all px-3 py-1 hover:ring hover:ring-focus focus:ring focus:ring-focus cursor-pointer')}
  >
    <ArrowBack /> Back
  </button>
}

const ArrowBack = withSvgProps((props) =>
  // lucide:arrow-left
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="m12 19l-7-7l7-7m7 7H5"></path>
  </svg>
)
