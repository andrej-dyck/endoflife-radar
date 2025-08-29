import { withSvgProps } from './withSvgProps.tsx'

export const LinkNewTab = ({ href, text, iconClass }: { href: string, text?: string, iconClass?: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-1"
  >
    {text}
    <ExternalLinkIcon className={iconClass} />
  </a>

/** lucide:external-link */
const ExternalLinkIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)
