import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navibar from "./components/Navbar/Navbar";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Cadastro from "./pages/Cadastro/Cadastro";
import Listagem from "./pages/Listagem/Listagem";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from "./components/PrivateRoute/auth.js";

function App() {
  return (
   <AuthProvider>
     <Router>
      {/* Navbar fora das rotas */}
      <Navibar />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Cadastro />} />

        {/* Rotas protegidas */}
        <Route
          path="/listagem"
          element={
            <PrivateRoute>
              <Listagem />
            </PrivateRoute> 
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
   </AuthProvider>
  );
}

export default App;
