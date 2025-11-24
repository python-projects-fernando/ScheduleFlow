// import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import './App.css'
// import HomePage from './pages/HomePage'

// function App() {  
//   return (
//     <>
//     <HomePage></HomePage>
//     </>
//   )
// }

// export default App


// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ajuste o caminho se necessário
import CalendarAvailability from './components/CalendarAvailability'; // Importe o novo componente
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />          
            <Route path="/booking" element={<CalendarAvailability />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />          
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;