export const getProgress = (assignments) => {
  if (!assignments || assignments.length === 0) return null
  const done = assignments.filter((assignment) => assignment.done).length
  return done / assignments.length
}

export const getProgressPercent = (assignments) => {
  const progress = getProgress(assignments)
  return progress === null ? null : Math.round(progress * 100)
}
