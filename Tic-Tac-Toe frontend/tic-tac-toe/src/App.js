
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import Login from './pages/Login';
import Register from './pages/Register';
import PlayOnline from './pages/PlayOnline';
import PlayWithBot from './pages/PlayWithBot';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<HomePage />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<Register />}/>
    <Route path="/playai" element={<Play />}/>
    <Route path="/playwithbot" element={<PlayWithBot />}/>
    <Route path="/playonline" element={<PlayOnline />}/>

   </Routes>
   </BrowserRouter>
  );
}

export default App;