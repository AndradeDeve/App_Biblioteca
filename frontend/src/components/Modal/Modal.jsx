  import React, { useEffect } from 'react';
  import './Modal.css';

  export default function Modal({
    password,
    setPassword,
    error,
    handleConfirmPassword,
    setShowModal
  }) {
    // Previne a interação com o fundo quando o modal estiver aberto
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleConfirmPassword();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirmPassword();
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Digite a senha de acesso</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              onKeyDown={handleKeyDown}
              placeholder="Senha"
              autoFocus
            />
            {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
            <div className="buttons">
              <button type="submit">Confirmar</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
