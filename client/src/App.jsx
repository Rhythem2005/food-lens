import { Routes, Route } from 'react-router-dom'
import FoodLensAI from './pages/homepage'
import Results from "./pages/Results";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


function App() {
  return (
    <Routes>
      <Route path="/" element={<FoodLensAI />} />
      <Route path="/results" element={<Results />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
