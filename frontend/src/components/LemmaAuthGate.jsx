import { useCallback, useEffect, useState } from 'react'
import { ApiError } from 'lemma-sdk'
import { useAuth } from 'lemma-sdk/react'
import { lemmaClient } from '../lib/lemmaClient.js'

/**
 * Lemma app auth gate:
 * - Unauthenticated → prompt sign-up (Lemma account required for all pod apps)
 * - Authenticated but not a pod member → auto self-join when join_policy is PUBLIC/ORG_MEMBERS
 * - Member → render children
 */
export default function LemmaAuthGate({ children, loadingFallback = null }) {
  const { isLoading, isAuthenticated, redirectToAuth } = useAuth(lemmaClient)
  const [membershipState, setMembershipState] = useState('idle') // idle | checking | member | joining | missing
  const [membershipError, setMembershipError] = useState(null)

  const ensureMembership = useCallback(async () => {
    if (!lemmaClient.podId) {
      setMembershipState('member')
      return
    }

    setMembershipState('checking')
    setMembershipError(null)

    try {
      const user = await lemmaClient.users.current()
      try {
        await lemmaClient.podMembers.lookupByUserId(lemmaClient.podId, user.id)
        setMembershipState('member')
        return
      } catch (err) {
        const apiErr = err instanceof ApiError ? err : null
        if (apiErr?.statusCode !== 403 && apiErr?.statusCode !== 404) throw err
      }

      // Try instant self-join (PUBLIC / ORG_MEMBERS join policies)
      setMembershipState('joining')
      try {
        await lemmaClient.request('POST', `/pods/${lemmaClient.podId}/join`)
        setMembershipState('member')
        return
      } catch (joinErr) {
        const joinApiErr = joinErr instanceof ApiError ? joinErr : null
        // 409 = already a member
        if (joinApiErr?.statusCode === 409) {
          setMembershipState('member')
          return
        }
      }

      // Fallback: invite-only pods need an admin-approved request
      try {
        await lemmaClient.podJoinRequests.create(lemmaClient.podId)
      } catch {
        // non-fatal — user may already have a pending request
      }

      setMembershipState('missing')
    } catch (err) {
      setMembershipError(err instanceof Error ? err.message : 'Failed to verify pod access.')
      setMembershipState('missing')
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setMembershipState('idle')
      return
    }
    void ensureMembership()
  }, [isAuthenticated, ensureMembership])

  if (isLoading || (isAuthenticated && (membershipState === 'checking' || membershipState === 'joining'))) {
    return loadingFallback
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
        <div className="saas-card max-w-md w-full p-8 text-center">
          <div className="text-3xl mb-4">✨</div>
          <h1 className="text-xl font-bold text-[var(--text)] mb-2">Welcome to Resumint</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Create a free Lemma account or sign in to tailor your resume with AI.
            Pod access is open — no admin approval needed.
          </p>
          <button
            type="button"
            onClick={() => redirectToAuth({ mode: 'signup' })}
            className="btn-primary w-full py-3 text-sm font-semibold mb-3"
          >
            Sign Up / Sign In
          </button>
          <p className="text-xs text-[var(--text-muted)]">
            You&apos;ll return here automatically after signing in.
          </p>
        </div>
      </div>
    )
  }

  if (membershipState === 'missing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
        <div className="saas-card max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-[var(--text)] mb-2">Access pending</h1>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Your access request was sent. A pod admin must approve it, or try refreshing
            if you just updated pod join settings.
          </p>
          {membershipError && (
            <p className="text-xs text-red-500 mb-4">{membershipError}</p>
          )}
          <button
            type="button"
            onClick={() => void ensureMembership()}
            className="btn-primary w-full py-3 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return children
}
