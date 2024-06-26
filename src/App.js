import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext.js';
import LoginComponent from './Components/LoginComponent.js';
import PrivateRoute from './Components/PrivateRoute.js';
import Home from './Pages/Home.jsx';
import NotFound from './Pages/NotFound.jsx';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          {/* <PrivateRoute path="/new" element={<Home />} roles={['admin', 'user']} /> */}
          {/* <Route path="/new" element={<PrivateRoute element={<Home />} />} /> */}
          

        <Route
              path="/new"
              element={
                <AuthProvider>
                  {({ role }) => (
                    role === 'admin' ? (
                      <Home />
                    ) : (
                      Navigate('/login', { replace: true })
                    )
                  )}
                </AuthProvider>
              }
          />

          {/* <Route path="/" element={<Home />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
