import { fetchallusers } from './action/users';
import './App.css';
import './pages/Userprofile/Userprofile.css'; // <-- Corrected path
import { useEffect, useState } from 'react';
import Navbar from './Comnponent/Navbar/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import Allroutes from './Allroutes';
import { useDispatch } from 'react-redux';
import { fetchallquestion } from './action/question';
import { requestNotificationPermission } from './utils/notify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [slidein, setslidein] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchallusers());
    dispatch(fetchallquestion());
  }, [dispatch]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setslidein(false);
    }
  }, []);

  // Request notification permission on app load (not needed for toast, but kept for compatibility)
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleslidein = () => {
    if (window.innerWidth <= 768) {
      setslidein((state) => !state);
    }
  };

  return (
    <div className="App">
      <Router>
        <Navbar handleslidein={handleslidein} />
        <Allroutes slidein={slidein} handleslidein={handleslidein} />
        {/* Toast notifications container */}
        <ToastContainer position="bottom-right" />
      </Router>
    </div>
  );
}

export default App;