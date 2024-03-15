import { SVGProps } from 'react'

/** svg-spinners:bars-scale-fade */
export const SpinnerBars = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <rect width="6" height="14" x="1" y="4" fill="currentColor">
      <animate id="svgSpinnersBarsScaleFade0" fill="freeze" attributeName="y"
        begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;5"></animate>
      <animate fill="freeze" attributeName="height" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s"
        values="22;14"></animate>
      <animate fill="freeze" attributeName="opacity" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s"
        values="1;.2"></animate>
    </rect>
    <rect width="6" height="14" x="9" y="4" fill="currentColor" opacity=".4">
      <animate fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s"
        values="1;5"></animate>
      <animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s"
        values="22;14"></animate>
      <animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s"
        values="1;.2"></animate>
    </rect>
    <rect width="6" height="14" x="17" y="4" fill="currentColor" opacity=".3">
      <animate id="svgSpinnersBarsScaleFade1" fill="freeze" attributeName="y"
        begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;5"></animate>
      <animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s"
        values="22;14"></animate>
      <animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s"
        values="1;.2"></animate>
    </rect>
  </svg>
)

/** svg-spinners:90-ring-with-bg */
export const SpinnersRing = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
      opacity=".25"></path>
    <path fill="currentColor"
      d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
      <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
        values="0 12 12;360 12 12"></animateTransform>
    </path>
  </svg>
)