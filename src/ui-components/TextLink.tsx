import React from 'react'
import { Link } from 'react-router'
import { cns } from './twMerge.tsx'
import { withSvgProps } from './withSvgProps.tsx'

export const TextLink = (props:
  { children: React.ReactNode, className?: string } &
  ({ href: string, external?: boolean } | { to: string })
) => {
  const linkStyle = cns('text-a-text transition-all hover:text-focus focus:text-focus', props.className)

  const externalLinkProps = 'external' in props && props.external
    ? { target: '_blank', rel: 'noopener noreferrer' } as const
    : undefined

  return 'href' in props
    ? <a href={props.href} {...externalLinkProps} className={linkStyle}>{props.children}</a>
    : <Link to={props.to} className={linkStyle}>{props.children}</Link>
}

/** lucide:external-link */
export const ExternalLinkIcon = withSvgProps((props) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)
