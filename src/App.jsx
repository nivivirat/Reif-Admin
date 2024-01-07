import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './Components/Events/Events';

function App() {
  return (
    <BrowserRouter>
      <div className="font-poppins w-screen overflow-clip no-vertical-scroll">

        <Routes>
          <Route path="/events" element={<Events />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;

