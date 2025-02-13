
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayWithAI from './pages/PlayWithAI';
import Login from './pages/Login';
import Register from './pages/Register';
import PlayOnline from './pages/PlayOnline';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<HomePage />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<Register />}/>
    <Route path="/playai" element={<PlayWithAI />}/>
    <Route path="/playonline" element={<PlayOnline />}/>

   </Routes>
   </BrowserRouter>
  );
}

export default App;