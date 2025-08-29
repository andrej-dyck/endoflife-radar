import React, { type FunctionComponent, type SVGProps } from 'react'

export const withSvgProps = (SvgElement: FunctionComponent<SVGProps<SVGSVGElement>>) =>
  React.memo((props: SVGProps<SVGSVGElement>) => <SvgElement {...props} />)
