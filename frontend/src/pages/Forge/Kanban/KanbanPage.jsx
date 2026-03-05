import { useParams } from 'react-router-dom'
import { KanbanProvider } from '~/context/KanbanContext'
import { KanbanBoard } from '~/components/Kanban/KanbanBoard/KanbanBoard'

export default function KanbanPage() {
  const { category } = useParams()

  return (
    <KanbanProvider>
      <KanbanBoard category={category} />
    </KanbanProvider>
  )
}
