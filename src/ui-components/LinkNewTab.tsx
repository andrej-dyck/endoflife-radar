import React, { SVGProps } from 'react'

export const LinkNewTab = ({ href, text, iconClass }: { href: string, text?: string, iconClass?: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-1"
  >{text}<OpenInNewIcon className={iconClass} /></a>

const OpenInNewIcon = React.memo((props: SVGProps<SVGSVGElement>) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413T19 21zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4z"></path>
  </svg>
)
