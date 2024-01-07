import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './Components/Events/Events';
import SideBar from './Components/Common/SideBar/SideBar';

function App() {
  return (
    <BrowserRouter>
      <div className="font-poppins w-screen overflow-clip no-vertical-scroll">
        
        <SideBar />

        <div className="ml-[50px]">
          <Routes>
            <Route path="/Events" element={<Events />} />
            {/* <Route path="/" element={<Events />} /> */}
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
