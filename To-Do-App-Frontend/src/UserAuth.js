import React from 'react';

function UserAuth({
                      isLogin, setIsLogin,
                      firstName, setFirstName, lastName, setLastName,
                      email, setEmail, password, setPassword,
                      authMessage, handleUserSubmit
                  }) {

    return (
        <div style={{ maxWidth: '450px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '1rem', border: 'none' }}
             className="auth-card-container card p-4 bg-white">
            <h2 className="card-title text-center mb-4 text-secondary">{isLogin ? "Prijava" : "Registracija"}</h2>

            <form onSubmit={handleUserSubmit}> {/* Uporaba prop-a handleUserSubmit iz App.js */}
                {!isLogin && (
                    <>
                        <div className="mb-3">
                            <input type="text" className="form-control form-control-lg" placeholder="Ime"
                                   value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control form-control-lg" placeholder="Priimek"
                                   value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </>
                )}
                <div className="mb-3">
                    <input type="email" className="form-control form-control-lg" placeholder="Email"
                           value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <input type="password" className="form-control form-control-lg" placeholder="Geslo"
                           value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">{isLogin ? "Prijava" : "Registracija"}</button>
            </form>

            {authMessage && <p className="text-center text-danger small mt-3">{authMessage}</p>}

            <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link w-100 text-decoration-none text-secondary">
                {isLogin ? "Ustvari nov račun" : "Nazaj na prijavo"}
            </button>
        </div>
    );
}

export default UserAuth;