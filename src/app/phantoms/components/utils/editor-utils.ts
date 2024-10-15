
import { EditorCanvasCardType } from '../types/EditorCanvasTypes'

export const onDragStart = (
  event: any,
  nodeType: EditorCanvasCardType['specificType']
) => {
  event.dataTransfer.setData('application/reactflow', nodeType)
  event.dataTransfer.effectAllowed = 'move'
}
