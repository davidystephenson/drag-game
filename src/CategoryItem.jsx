import { useState, useRef } from "react";
import ReactCrop from 'react-image-crop'; 
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import centerAspectCrop from "./centerAspectCrop";
export default function CategoryItem ({ item, itemIndex, categories, categoryIndex, setCategories }) {
  function handleItemChange (property, value) {
    setCategories(categories.map((category, currentCategoryIndex) => {
      if (currentCategoryIndex === categoryIndex) {
        const items = category.items.map((item, currentItemIndex) => {
          if (currentItemIndex === itemIndex) {
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
  function handleItemImageChange (url) {
    handleItemChange('image', url);
  }
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        handleItemImageChange(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  function handleCrop() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob')
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        handleItemImageChange(reader.result?.toString() || '')
        setCrop(undefined)
      }
    })
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        )
      }
    },
    100,
    [completedCrop],
  )
  return (
    <li key={itemIndex}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <input
          style={{ height: 'fit-content' }}
          placeholder='Item text'
          value={item.text}
          onChange={handleItemTextChange}
        />
        <div>
          <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
          </div>
          {item.image && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={item.image}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
          {completedCrop && (
            <>
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
              <div>
                <button onClick={handleCrop}>Crop</button>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  )
}