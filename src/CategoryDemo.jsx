import { useState } from 'react'
import CategoryItem from './CategoryItem'
import placeholderImage from './placeholderImage'

const placeholderCategories = [
  { 
    name: 'Category 1',
    items: [
      { text: 'Demo item', image: placeholderImage }
    ]
  },
  {
    name: 'Category 2',
    items: [
      { text: 'Demo item 2', image: placeholderImage },
      { text: 'Demo item 3', image: placeholderImage }
    ]
  }
]

export default function CategoryDemo () {
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem('categories')
    console.log('storedCategories', storedCategories)
    if (storedCategories == null) {
      return placeholderCategories
    }
    return JSON.parse(storedCategories)
  })
  const categoryViews = categories.map((category, categoryIndex) => {
    function handleNameChange (event) {
      setCategories(categories.map((category, i) => {
        if (i === categoryIndex) {
          return {
            ...category,
            name: event.target.value
          }
        }
        return category
      }))
    }
    const itemViews = category.items.map((item, itemIndex) => {
      return (
        <CategoryItem
          key={itemIndex}
          item={item}
          categoryIndex={categoryIndex}
          itemIndex={itemIndex}
          categories={categories}
          setCategories={setCategories}
        />
      )
    })

    function handleAddItem () {
      setCategories(categories.map((category, i) => {
        if (i === categoryIndex) {
          return {
            ...category,
            items: [...category.items, { text: '', image: '' }]
          }
        }
        return category
      }))
    }
    return (
      <div key={categoryIndex} style={{ background: 'lightgray', margin: '10px', padding: '10px' }}>
        <input placeholder='Category name' value={category.name} onChange={handleNameChange} />
        <ol>{itemViews}</ol>
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    )
  })
  function handlePlusCategory () {
    const category = {
      name: '',
      items: [{ text: '', image: '' }]
    }
    setCategories([...categories, category])
  }
  function handleSave () {
    localStorage.setItem('categories', JSON.stringify(categories))
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {categoryViews}
        <button style={{ height: 'fit-content'}} onClick={handlePlusCategory}>Add Category</button>
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}