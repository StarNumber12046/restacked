'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { env } from '~/env'

if (typeof window !== 'undefined') {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: "/ingest",
  })
}
export function PostHogClerkWrapper({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const userInfo = useUser();
  useEffect(() => {
    if(userInfo.user) posthog.identify(userInfo.user.id, {email: userInfo.user.emailAddresses[0]?.emailAddress, username: userInfo.user.username});
    else if (!auth.isSignedIn) posthog.reset()
  }, [userInfo, auth])
  return (
    children
  )
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return (
      <PostHogProvider client={posthog}>
        <PostHogClerkWrapper>
          {children}
        </PostHogClerkWrapper>
      </PostHogProvider>
      )
}