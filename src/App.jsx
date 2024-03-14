import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './Components/Events/Events';
import SideBar from './Components/Common/SideBar/SideBar';
import Careers from './Components/Careers/Careers';
import ContactUs from './Components/ContactUs/ContactUs';
import AdminPanel from './Components/Media/Media';
import AdminPanel1 from './Components/Media/MediaCard'
import Newsletter from './Components/Newsletter/Newsletter';
import Home from './Components/Home/Home';
import TestAdmin from './Components/Testinomials/Testinomials';
import Principals from './Components/Principals/Principals';
import SingleFileUpload from './Components/Media/SingleFileUpload';
import CareersImage from './Components/CareersImage/CareersImage';
import Login from './Components/Login/Login';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import YouTubeVideo from './Components/YouTubeVideo/YouTubeVideo';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for changes in the user's token, including sign-in and password changes
    const unsubscribeTokenChanged = auth.onIdTokenChanged((user) => {
      if (!user) {
        // User is logged out due to a password change
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTokenChanged();
    };
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <BrowserRouter>
      <div className="font-poppins w-[95vw] overflow-clip no-vertical-scroll ml-[50px] mt-[80px]">
        <Routes>
          {!user && <Route path="*" element={<Login />} />}
          {user && (
            <>
              <Route path="/media/:id/:heading" element={<SingleFileUpload />} />
              <Route path="/Events" element={<Events />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/CareersImage" element={<CareersImage />} />
              <Route path="/contactUs" element={<ContactUs />} />
              <Route path="/media" element={<AdminPanel />} />
              <Route path="/mediacard" element={<AdminPanel1 />} />
              <Route path="/Newsletter" element={<Newsletter />} />
              <Route path="/" element={<Home />} />
              <Route path="/testimonials" element={<TestAdmin />} />
              <Route path="/principals" element={<Principals />} />
              <Route path="/YoutubeVideo" element={<YouTubeVideo />} />
            </>
          )}
        </Routes>
        {user && <SideBar />}
      </div>
    </BrowserRouter>
  );
}

export default App;
