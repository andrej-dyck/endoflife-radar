import { OpenInNewIcon } from '../icons/OpenInNewIcon.tsx'

export const LinkNewTab = ({ href, text }: { href: string, text?: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-1"
  >{text ?? href}<OpenInNewIcon /></a>
