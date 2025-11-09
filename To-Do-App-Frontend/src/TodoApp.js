import React, { useState, useEffect } from 'react';

const URL = "http://localhost:8080/api/todos";

function TodoApp({ user, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newNaslov, setNewNaslov] = useState('');
    const [editingID, setEditingID] = useState(null);
    const [editingNaslov, setEditingNaslov] = useState('');
    const [editingOpis, setEditingOpis] = useState('');

    const fetchTodos = async () => {
        try {
            const response = await fetch(URL);
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (error) {
            console.log('Napaka pri nalaganju opravil:', error);
        }
    };

    useEffect(() => { fetchTodos(); }, []);

    const createTodo = async (e) => {
        e.preventDefault();
        if (!newNaslov.trim()) return;

        const newItem = { naslov: newNaslov, opis: 'opis ni podan', opravljeno: false };
        try {
            await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            setNewNaslov('');
            fetchTodos();
        } catch (error) {
            console.log('Napaka pri ustvarjanju To-doja:', error);
        }
    };

    const updateTodo = async (id) => {
        const updated = {
            id,
            naslov: editingNaslov,
            opis: editingOpis,
            opravljeno: todos.find(t => t.id === id).opravljeno
        };
        try {
            await fetch(URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            setEditingID(null);
            fetchTodos();
        } catch (error) {
            console.log('Napaka pri posodabljanju:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await fetch(`${URL}/${id}`, { method: 'DELETE' });
            fetchTodos();
        } catch (error) {
            console.log('Napaka pri brisanju:', error);
        }
    };

    const markDone = async (todo) => {
        const updated = { ...todo, opravljeno: true };
        try {
            await fetch(URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            fetchTodos();
        } catch (error) {
            console.log('Napaka pri označevanju:', error);
        }
    };

    return (
        <div className="app-card-container card p-4 bg-white">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="card-title fs-2 text-primary">Seznam Opravil</h1>
                <button onClick={onLogout} className="btn btn-outline-danger btn-sm">Odjava</button>
            </div>

            <form onSubmit={createTodo} className="input-group mb-4">
                <input
                    type="text"
                    className="form-control form-control-lg" // Večji input
                    placeholder="Nov naslov opravila..."
                    value={newNaslov}
                    onChange={(e) => setNewNaslov(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">Dodaj</button>
            </form>

            {todos.length === 0 ? (
                <div className="alert alert-info text-center mt-3" role="alert">
                    Trenutno nimate opravil.
                </div>
            ) : (
                <ul className="list-group list-group-flush">
                    {todos.map(t => (
                        <li key={t.id} className={`list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3 ${t.opravljeno ? 'bg-light text-muted' : ''}`}>

                            {/* Prikaz ali urejanje vsebine opravila */}
                            {editingID === t.id ? (
                                <div className="w-100 mb-2 mb-md-0">
                                    <input type="text" value={editingNaslov}
                                           onChange={(e) => setEditingNaslov(e.target.value)}
                                           className="form-control mb-2" />
                                    <textarea value={editingOpis}
                                              onChange={(e) => setEditingOpis(e.target.value)}
                                              className="form-control mb-2"
                                              placeholder="Opis (neobvezno)"/>
                                    <button onClick={() => updateTodo(t.id)} className="btn btn-success btn-sm me-2">Shrani</button>
                                    <button onClick={() => setEditingID(null)} className="btn btn-secondary btn-sm">Prekliči</button>
                                </div>
                            ) : (
                                <div className="flex-grow-1 me-md-3">
                                    <p className={`lead mb-0 ${t.opravljeno ? 'text-decoration-line-through' : ''}`}>
                                        <strong>{t.naslov}</strong>
                                    </p>
                                    <small className={`text-break ${t.opravljeno ? 'text-decoration-line-through' : 'text-muted'}`}>{t.opis || "Opis ni podan"}</small>
                                </div>
                            )}

                            {editingID !== t.id && (
                                <div className="btn-group mt-2 mt-md-0" role="group">
                                    <button onClick={() => setEditingID(t.id) || setEditingNaslov(t.naslov) || setEditingOpis(t.opis)}
                                            className="btn btn-outline-info btn-sm">Uredi</button>
                                    <button onClick={() => deleteTodo(t.id)}
                                            className="btn btn-outline-danger btn-sm">Izbriši</button>
                                    {!t.opravljeno && (
                                        <button onClick={() => markDone(t)}
                                                className="btn btn-outline-success btn-sm">Opravljeno</button>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TodoApp;
