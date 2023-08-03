import { useState, useMemo } from 'react'
import Item from './Item'
import {
  defaultDropAnimationSideEffects,
  DndContext,
  useSensor,
  PointerSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  SortableContext
} from '@dnd-kit/sortable'
import Draggable from './Draggable'
import Droppable from './Droppable'
const DROP_ANIMATION = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
}

const placeholderCategories = [
  { 
    name: 'Category 1',
    items: [
      { text: 'Demo item', image: 'https://via.placeholder.com/150' }
    ]
  },
  {
    name: 'Category 2',
    items: [
      { text: 'Demo item 2', image: 'https://via.placeholder.com/150' },
      { text: 'Demo item 3', image: 'https://via.placeholder.com/150' }
    ]
  }
]

function shuffle (items) {
  const entries = items.map((item) => [Math.random(), item])
  entries.sort((a, b) => a[0] - b[0])
  return entries.map((entry) => entry[1])
}

export default function PlayerDemo () {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  const sensors = useSensors(sensor)
  const categories = useMemo(() => {
    const storedCategories = localStorage.getItem('categories')
    if (storedCategories == null) {
      return placeholderCategories
    }
    const parsed = JSON.parse(storedCategories).map((category) => {
      const items = category.items.map((item) => {
        return { ...item, category: category.name }
      })
      return { ...category, items }
    })
    return parsed
  }, [])
  const [categoryItems, setCategoryItems] = useState(() => {
    return categories.reduce((acc, category) => {
      acc[category.name] = []
      return acc
    }, {})
  })
  const flatItems = categories.flatMap(category => category.items)
  const [generalItems, setGeneralItems] = useState(() => {
    const shuffledItems = shuffle(flatItems)
    return shuffledItems
  })
  const allItemViews = generalItems.map((item, index) => {
    return <Item key={index} item={item} categories={categories} setCategoryItems={setCategoryItems} setAllItems={setGeneralItems} />
  })
  const categoryViews = categories.map((category, index) => {
    const categoryItemViews = categoryItems[category.name].map((item, index) => {
      return (
        <Item key={index} item={item} categories={categories} setCategoryItems={setCategoryItems} setAllItems={setGeneralItems} />
      )
    })
    return (
      <Droppable key={index} id={category.name}>
        <div key={index} style={{height: '500px', background: 'black', color: 'white', padding:'20px', margin: '20px'}}>
          {category.name}
          <div style={{ display: 'flex' }}>
            {categoryItemViews}
          </div>
        </div>
      </Droppable>
    )
  })
  const [percent, setPercent] = useState()
  function handleSubmit () {
    const correctItems = flatItems.filter((item) => {
      console.log('submit item', item)
      const selectedCategory = categories.find((category) => {
        const items = categoryItems[category.name]
        const selected = items.some((otherItem) => otherItem.text === item.text)
        return selected
      })
      console.log('selectedCategory', selectedCategory)
      if (selectedCategory == null) {
        return false
      }
      return selectedCategory.name === item.category
    })
    console.log('correctItems', correctItems)
    const percent = (correctItems.length / flatItems.length) * 100
    console.log('percent', percent)
    setPercent(percent)
  }
  const score = percent != null && <div style={{ background: 'gray', padding: '20px' }}>{percent}%</div>
  const [active, setActive] = useState(null)
  const activeView = active && (
    <Draggable>
      <Item item={active} categories={categories} setCategoryItems={setCategoryItems} setAllItems={setGeneralItems} />
    </Draggable>
  )
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        const item = flatItems.find((item) => item.text === active.id)
        setActive(item)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
      onDragEnd={({ active, over }) => {
        console.log('over', over)
        setActive(null)
        if (over != null) {
          setCategoryItems((currentCategoryItems) => {
            const newCategoryItems = { ...currentCategoryItems }
            const activeItem = flatItems.find((item) => item.text === active.id)
            console.log('activeItem', activeItem)
            const activeGeneral = generalItems.some((item) => item.text === activeItem.text)
            const overGeneral = generalItems.some((item) => item.text === over.id)
            if (overGeneral) {
              if (activeGeneral) {
                return newCategoryItems
              }
              setGeneralItems((currentGeneralItems) => {
                const general = currentGeneralItems.some((item) => item.text === active.id)
                if (general) {
                  return currentGeneralItems
                }
                const overIndex = currentGeneralItems.findIndex((scheme) => scheme.id === over.id)
                const beforeIndex = currentGeneralItems.slice(0, overIndex)
                const afterIndex = currentGeneralItems.slice(overIndex)
                const newGeneralItems = [...beforeIndex, activeItem, ...afterIndex]
                console.log('newGeneralItems', newGeneralItems)
                return newGeneralItems
              })
              const activeCategory = categories.find((category) => {
                return categoryItems[category.name].some((item) => item.text === active.id)
              })
              console.log('activeCategory', activeCategory)
              const items = newCategoryItems[activeCategory.name]
              const newItems = items.filter((otherItem) => otherItem.text !== active.id)
              newCategoryItems[activeCategory.name] = newItems
              return newCategoryItems
            }
            const items = newCategoryItems[over.id]
            if (items == null) {
              const overCategory = categories.find((category) => {
                return categoryItems[category.name].some((item) => item.text === over.id)
              })
              if (overCategory == null) {
                return newCategoryItems
              }
              const items = newCategoryItems[overCategory.name]
              const newItems = [...items, activeItem]
              newCategoryItems[overCategory.name] = newItems
              const activeCategory = categories.find((category) => {
                return categoryItems[category.name].some((item) => item.text === active.id)
              })
              if (activeCategory == null) {
                setGeneralItems((currentGeneralItems) => currentGeneralItems
                  .filter((otherItem) => otherItem.text !== activeItem.text)
                )
                return newCategoryItems
              }
              const activeItems = newCategoryItems[activeCategory.name]
              const newActiveItems = activeItems.filter((otherItem) => otherItem.text !== active.id)
              newCategoryItems[activeCategory.name] = newActiveItems
              return newCategoryItems
            }
            const newItems = [...items, activeItem]
            newCategoryItems[over.id] = newItems
            setGeneralItems((currentGeneralItems) => currentGeneralItems
              .filter((otherItem) => otherItem.text !== activeItem.text)
            )
            const activeCategory = categories.find((category) => {
              return categoryItems[category.name].some((item) => item.text === active.id)
            })
            if (activeCategory == null) {
              return newCategoryItems
            }
            const activeItems = newCategoryItems[activeCategory.name]
            const newActiveItems = activeItems.filter((otherItem) => otherItem.text !== active.id)
            newCategoryItems[activeCategory.name] = newActiveItems
            return newCategoryItems
          })
        }
      }}
    >
      <SortableContext items={generalItems}>
        <div style={{ display: 'flex' }}>
          {allItemViews}
        </div>
      </SortableContext>
      <div style={{ display: 'flex' }}>
        {categoryViews}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {score}
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeView}
      </DragOverlay>
    </DndContext>
  )
}