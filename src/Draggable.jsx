import {useDraggable} from '@dnd-kit/core';

export default function Draggable({ id = 'draggable', children }) {
  const {attributes, listeners, setNodeRef, transition, isDragging} = useDraggable({
    id,
  });

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transition: transition,
    touchAction: 'none'
  }
  
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
}