import DraggableDemo from './DraggableDemo';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import CategoryDemo from './CategoryDemo';
import PlayerDemo from './PlayerDemo';

function App() {
  return (
    <div>
      <div>
        <Link to="/draggable">Draggable Demo</Link>
        <Link to='/category'>Category Demo</Link>
        <Link to='/player'>Player Demo</Link>
      </div>
      <Routes>
        <Route path="/draggable" element={<DraggableDemo />} />
        <Route path="/category" element={<CategoryDemo />} />
        <Route path="/player" element={<PlayerDemo />} />
      </Routes>
    </div>
  )
}

export default App
