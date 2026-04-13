'use client'

// React Imports
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Service Imports
import { UserService } from '@/service/user/user.service'

// Component Imports
import WelcomeDialog from './WelcomeDialog'

// Style Imports
import 'driver.js/dist/driver.css'
import './tour.css'

// ─── Context ────────────────────────────────────────────────────────────────

interface TourContextType {
  openTourDialog: () => void
}

const TourContext = createContext<TourContextType>({
  openTourDialog: () => {}
})

export const useTourContext = () => useContext(TourContext)

// ─── Helpers ────────────────────────────────────────────────────────────────

const tourKey = (userId: string) => `soosmart_tour_v1_${userId}`

// ─── Provider ───────────────────────────────────────────────────────────────

const TourProvider = ({ children }: { children: ReactNode }) => {
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Auto-trigger: fetch current user, show tour dialog if never seen
  useEffect(() => {
    UserService.useConnect()
      .then(user => {
        setUserId(user.id)

        if (!localStorage.getItem(tourKey(user.id))) {
          // Small delay so the page finishes rendering before the dialog appears
          const timer = setTimeout(() => setWelcomeOpen(true), 800)

          return () => clearTimeout(timer)
        }
      })
      .catch(() => {
        // Not authenticated or API unavailable — silently ignore
      })
  }, [])

  const markSeen = useCallback(() => {
    if (userId) localStorage.setItem(tourKey(userId), 'done')
  }, [userId])

  // Called from UserDropdown "Démarrer le tour"
  const openTourDialog = useCallback(() => {
    if (userId) localStorage.removeItem(tourKey(userId))
    setWelcomeOpen(true)
  }, [userId])

  // ── Tour launch ────────────────────────────────────────────────────────────
  const launchDriverTour = useCallback(async () => {
    const { driver } = await import('driver.js')
    const { getTourSteps } = await import('./tourSteps')

    const driverObj = driver({
      showProgress: true,
      steps: getTourSteps(),
      nextBtnText: 'Suivant →',
      prevBtnText: '← Précédent',
      doneBtnText: 'Terminer ✓',
      progressText: '{{current}} / {{total}}',
      allowClose: true,
      overlayOpacity: 0.5,
      smoothScroll: true,
      onDestroyed: markSeen
    })

    driverObj.drive()
  }, [markSeen])

  // ── Dialog handlers ────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setWelcomeOpen(false)

    // Wait for dialog close animation before highlighting elements
    await new Promise<void>(resolve => setTimeout(resolve, 250))
    await launchDriverTour()
  }, [launchDriverTour])

  const handleSkip = useCallback(() => {
    markSeen()
    setWelcomeOpen(false)
  }, [markSeen])

  const handleLater = useCallback(() => {
    setWelcomeOpen(false)
  }, [])

  return (
    <TourContext.Provider value={{ openTourDialog }}>
      {children}
      <WelcomeDialog
        open={welcomeOpen}
        onStart={handleStart}
        onSkip={handleSkip}
        onLater={handleLater}
      />
    </TourContext.Provider>
  )
}

export default TourProvider
