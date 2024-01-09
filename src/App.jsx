import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './Components/Events/Events';
import SideBar from './Components/Common/SideBar/SideBar';
import Careers from './Components/Careers/Careers';
import ContactUs from './Components/ContactUs/ContactUs';
import AdminPanel from './Components/Media/Media';
import AdminPanel1 from './Components/Media/MediaCard'
import Newsletter from './Components/Newsletter/Newsletter';
import Home from './Components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="font-poppins w-screen overflow-clip no-vertical-scroll">
        
        <SideBar />

        <div className="ml-[50px] mt-[80px]">
          <Routes>
            <Route path="/Events" element={<Events />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contactUs" element={<ContactUs />} />
             <Route path="/media" element={<AdminPanel />} />
            <Route path="/mediacard" element={<AdminPanel1 />} />
            <Route path="/Newsletter" element={<Newsletter />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;