import { useState } from 'react'

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
    const itemViews = category.items.map((item, imageIndex) => {
      function handleItemChange (property, value) {
        setCategories(categories.map((category, currentCategoryIndex) => {
          if (currentCategoryIndex === categoryIndex) {
            const items = category.items.map((item, currentItemIndex) => {
              if (currentItemIndex === imageIndex) {
                return {
                  ...item,
                  [property]: value
                }
              }
              return item
            })
            return {
              ...category,
              items
            }
          }
          return category
        }))
      }
      function handleItemTextChange (event) {
        handleItemChange('text', event.target.value)
      }
      function handleItemImageChange (event) {
        handleItemChange('image', event.target.value)
      }
      return (
        <li key={imageIndex}>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <input style={{ height: 'fit-content' }} placeholder='Item text' value={item.text} onChange={handleItemTextChange} />
            <div>
              <div>
                <input style={{ height: 'fit-content' }} placeholder='Item image' value={item.image} onChange={handleItemImageChange} />
              </div>
              <img src={item.image} alt={item.text} />
            </div>
          </div>
        </li>
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
      <div key={categoryIndex}>
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