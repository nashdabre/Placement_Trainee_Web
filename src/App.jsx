import { useState } from 'react'
import Dashboard from './Components/Dashboard'
import CareerPlanner from './Components/CareerPlanner'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/career-planner" element={<CareerPlanner />} />
      </Routes>
    </Router>
  )
}

   
export default App
