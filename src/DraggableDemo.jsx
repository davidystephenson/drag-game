import {useState} from 'react';
import { defaultDropAnimationSideEffects, DndContext, useSensor, PointerSensor, useSensors, DragOverlay } from '@dnd-kit/core'

import Droppable from './Droppable';
import Draggable from './Draggable';

const DROP_ANIMATION = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
}

function DraggableDemo() {
  const [active, setActive] = useState(null)
  const [dropped, setDropped] = useState(false)
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  const sensors = useSensors(sensor)
  const activeView = active ? (<Draggable>Drag me</Draggable>) : null
  const draggableView = dropped ? null : <Draggable>Drag me</Draggable>
  const droppableView = dropped ? <Draggable>Dragged!</Draggable> : <Droppable>Drop here</Droppable>
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
      onDragEnd={({ over }) => {
        setActive(null)
        if (over.id === 'droppable') {
          setDropped(true)
        }
      }}
      onDragOver={() => {
        console.log('over')
      }}
    >
      {draggableView}
      <div style={{height:'300px'}} />
      {droppableView}
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeView}
      </DragOverlay>

    </DndContext>
  );
}

export default DraggableDemo
