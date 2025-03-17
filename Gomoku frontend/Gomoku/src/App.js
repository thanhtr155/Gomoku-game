
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayOffline from './pages/PlayOffline';
import Login from './pages/Login';
import Register from './pages/Register';
import PlayWithAI from './pages/PlayWithAI';
import PlayOnline from './pages/PlayOnline';
import GomokuBoard from './pages/GomokuBoard';
import MainPage from './pages/MainPage';
import ExplainRules from './pages/ExplainRules'

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<MainPage />}/>
    <Route path='/main' element={<HomePage />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<Register />}/>
    <Route path="/playoffline" element={<PlayOffline />}/>
    <Route path="/playai" element={<PlayWithAI />}/>
    <Route path="/playonline" element={<GomokuBoard />}/>
    <Route path="/rules" element={<ExplainRules />}/>
    

   </Routes>
   </BrowserRouter>
  );
}

export default App;