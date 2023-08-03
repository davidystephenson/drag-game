import DraggableDemo from './DraggableDemo';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import CategoryDemo from './CategoryDemo';
import PlayerDemo from './PlayerDemo';
import CropDemo from './CropDemo';

function App() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to="/draggable">Draggable Demo</Link>
        <Link to='/category'>Category Demo</Link>
        <Link to='/player'>Player Demo</Link>
        <Link to='/crop'>Crop Demo</Link>
      </div>
      <Routes>
        <Route path="/draggable" element={<DraggableDemo />} />
        <Route path="/category" element={<CategoryDemo />} />
        <Route path="/player" element={<PlayerDemo />} />
        <Route path="/crop" element={<CropDemo />} />
      </Routes>
    </div>
  )
}

export default App
