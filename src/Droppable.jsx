import {useDroppable} from '@dnd-kit/core'

export default function Droppable({ id = 'droppable', children }) {
  const {isOver, setNodeRef} = useDroppable({
    id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}