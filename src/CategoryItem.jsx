import { useState } from "react";
import ReactCrop from 'react-image-crop'; 
export default function CategoryItem ({ item, itemIndex, categories, categoryIndex, setCategories }) {
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [image, setImage] = useState(null);
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
  function handleItemImageChange (event) {
    const file = event.target.files[0]
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      handleItemChange('image', fileReader.result);
    }
  }
  // function handleCrop () {
  //   const canvas = document.createElement('canvas');
  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;
  //   canvas.width = crop.width;
  //   canvas.height = crop.height;
  //   const ctx = canvas.getContext('2d');

  //   const pixelRatio = window.devicePixelRatio;
  //   canvas.width = crop.width * pixelRatio;
  //   canvas.height = crop.height * pixelRatio;
  //   ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  //   ctx.imageSmoothingQuality = 'high';

  //   ctx.drawImage(
  //       image,
  //       crop.x * scaleX,
  //       crop.y * scaleY,
  //       crop.width * scaleX,
  //       crop.height * scaleY,
  //       0,
  //       0,
  //       crop.width,
  //       crop.height,
  //   );

  //   const base64Image = canvas.toDataURL('image/jpeg')
  //   handleItemChange('image', base64Image)
  // };
  console.log('item.image', item.image)
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
            <input
              style={{ height: 'fit-content' }}
              type='file'
              placeholder='Item image'
              onChange={handleItemImageChange}
            />
          </div>
          <ReactCrop
            src={item.image}
            onImageLoaded={setImage}
            crop={crop}
            onChange={setCrop}
          />

          {/* <img src={item.image} alt={item.text} width='200' /> */}
        </div>
      </div>
    </li>
  )
}