const tourKey = (userId: string) => `soosmart_tour_v1_${userId}`

export function useTour(userId: string) {
  const isSeen = () => !!localStorage.getItem(tourKey(userId))
  const markSeen = () => localStorage.setItem(tourKey(userId), 'done')
  const resetTour = () => localStorage.removeItem(tourKey(userId))

  return { isSeen, markSeen, resetTour }
}
