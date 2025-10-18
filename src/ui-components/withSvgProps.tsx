import { type FunctionComponent, type SVGProps } from 'react'

export const withSvgProps = (SvgElement: FunctionComponent<SVGProps<SVGSVGElement>>) =>
  (props: SVGProps<SVGSVGElement>) => <SvgElement {...props} />
