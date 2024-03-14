import { OpenInNewIcon } from '../icons/OpenInNewIcon.tsx'

export const LinkNewTab = ({ href, text, iconClass }: { href: string, text?: string, iconClass?: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-1"
  >{text}<OpenInNewIcon className={iconClass} /></a>
