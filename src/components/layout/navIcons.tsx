import type { SVGProps } from 'react'

export function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-6h4v6" strokeLinecap="round" />
    </svg>
  )
}

export function IconMyTrips(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path d="M9 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" strokeLinecap="round" />
      <path d="M9 3v18" strokeLinecap="round" />
      <path d="M15 7h4a2 2 0 0 1 2 2v9" strokeLinecap="round" />
      <path d="M15 11h6" strokeLinecap="round" />
      <path d="M15 15h4" strokeLinecap="round" />
    </svg>
  )
}

export function IconCar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path
        d="M5 17h14v-3l-1.5-4.5A2 2 0 0 0 15.6 8H8.4a2 2 0 0 0-1.9 1.5L5 14v3Z"
        strokeLinejoin="round"
      />
      <circle cx={7.5} cy={17} r={1.8} fill="currentColor" stroke="none" />
      <circle cx={16.5} cy={17} r={1.8} fill="currentColor" stroke="none" />
      <path d="M2 17h2.5M21.5 17H24" strokeLinecap="round" />
    </svg>
  )
}

export function IconActivity(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path d="M18 8a3 3 0 1 0-6 0c0 4-6 3-6 8h18c0-5-6-4-6-8Z" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
    </svg>
  )
}

export function IconProfile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <circle cx={12} cy={8} r={4} />
      <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  )
}
