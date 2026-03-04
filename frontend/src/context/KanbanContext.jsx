import { createContext, useContext, useState } from 'react'

export const KanbanContext = createContext(null)

export const KanbanProvider = ({ children }) => {
  const [issues, setIssues] = useState([])
  const [showArchived, setShowArchived] = useState(false)

  const moveIssue = (issueId, newStatus) => {
    setIssues((previousIssues) =>
      previousIssues.map((issue) => {
        const { id } = issue || {}
        return id === issueId ? { ...issue, status: newStatus } : issue
      }),
    )
  }

  return (
    <KanbanContext.Provider
      value={{ issues, setIssues, showArchived, setShowArchived, moveIssue }}
    >
      {children}
    </KanbanContext.Provider>
  )
}

export const useKanban = () => useContext(KanbanContext)
