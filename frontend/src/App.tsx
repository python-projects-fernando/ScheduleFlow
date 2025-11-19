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
import CalendarTest from './components/CalendarTest'; // Importe o novo componente
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Adicione uma rota para o teste do calendário */}
          <Route path="/calendar-test" element={<CalendarTest />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;