import type { SVGProps } from 'react'

const SW = 2.35

export function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={SW} aria-hidden {...props}>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-6h4v6" strokeLinecap="round" />
    </svg>
  )
}

export function IconMyTrips(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={SW} aria-hidden {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 11h4" strokeLinecap="round" />
      <path d="M12 16h4" strokeLinecap="round" />
      <circle cx="8" cy="11" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  )
}

const SW_KEYGO = 1.6

/** KeyGo mark — car key (same paths as KeyGoMobile `assets/logos/car-key-svgrepo-com.svg`). */
export function IconKeyGoLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={SW_KEYGO} aria-hidden {...props}>
      <path d="M5 8.00004L3 12.75" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M1.5 19.468V21C1.5 21.3978 1.65804 21.7794 1.93934 22.0607C2.22064 22.342 2.60218 22.5 3 22.5C3.39782 22.5 3.77936 22.342 4.06066 22.0607C4.34196 21.7794 4.5 21.3978 4.5 21V19.6421"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 19.468V21C22.5 21.3978 22.342 21.7794 22.0607 22.0607C21.7794 22.342 21.3978 22.5 21 22.5C20.6022 22.5 20.2206 22.342 19.9393 22.0607C19.658 21.7794 19.5 21.3978 19.5 21V19.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.75 12.75H21.25C21.7804 12.75 22.2891 12.9607 22.6642 13.3358C23.0393 13.7109 23.25 14.2196 23.25 14.75V18.5C23.25 18.7652 23.1446 19.0196 22.9571 19.2071C22.7696 19.3946 22.5152 19.5 22.25 19.5H1.75C1.48478 19.5 1.23043 19.3946 1.04289 19.2071C0.855357 19.0196 0.75 18.7652 0.75 18.5V14.75C0.75 14.2196 0.960714 13.7109 1.33579 13.3358C1.71086 12.9607 2.21957 12.75 2.75 12.75V12.75Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 4.25C12.5 5.49265 13.5074 6.5 14.75 6.5C15.9926 6.5 17 5.49265 17 4.25C17 3.00736 15.9926 2 14.75 2C13.5074 2 12.5 3.00736 12.5 4.25Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.5 4.24988L7 4.24988L7 5.72783" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.25 16.5H9.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.25 16.125H20.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.75 16.125H3.75029" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.25 4.24988L9.25 5.85651" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12.75L19 8.00004" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden {...props}>
      <path
        d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 13 10s-5.7.6-7.5 1.1C4.7 11.3 4 12.1 4 13v3c0 .6.4 1 1 1h2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 17h14v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  )
}

export function IconActivity(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={SW} aria-hidden {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={SW} aria-hidden {...props}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconProfile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={SW} aria-hidden {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  )
}
