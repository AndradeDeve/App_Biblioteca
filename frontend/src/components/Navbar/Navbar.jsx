import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import "./Navbar.css";
import Modal from "../Modal/Modal.jsx";
import { useAuth } from "../PrivateRoute/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [targetRoute, setTargetRoute] = useState("");

  const handleProtectedClick = (e, route) => {
    e.preventDefault();
    setTargetRoute(route);
    setShowModal(true);
  };

  const handleConfirmPassword = () => {
    if (login(password)) {
      setShowModal(false);
      setPassword("");
      setError("");
      navigate(targetRoute);
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">Painel de Acessos</div>

        <ul className="navbar-links">
          <li><Link to="/">Cadastro</Link></li>

          <li>
            <Link to="#" onClick={(e) => handleProtectedClick(e, "/listagem")}>
              Listagem
            </Link>
          </li>
          <li>
            <Link to="#" onClick={(e) => handleProtectedClick(e, "/dashboard")}>
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      {showModal && (
        <Modal
          password={password}
          setPassword={setPassword}
          error={error}
          handleConfirmPassword={handleConfirmPassword}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
