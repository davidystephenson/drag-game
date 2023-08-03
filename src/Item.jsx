import { useSortable } from "@dnd-kit/sortable";

export default function Item ({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    style
  } = useSortable({ id: item.text })
  return (
    <div {...attributes} {...listeners} ref={setNodeRef} style={style} id={item.text}>
      <div style={{ padding: '10px', margin: '20px' }}>
        <div>{item.text}</div>
        <img src={item.image} alt={item.text} width='50' />
      </div>
    </div>
  )
}