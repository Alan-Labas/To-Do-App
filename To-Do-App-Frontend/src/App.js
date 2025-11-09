import React, { useState, useEffect, useCallback } from 'react';
import UserAuth from './UserAuth';

const URL_TODOS = "http://localhost:8080/api/todos";
const URL_USERS = "http://localhost:8080/api/users";

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodoNaslov, setNewTodoNaslov] = useState('');
    const [editingID, setEditingID] = useState(null);
    const [editingNaslov, setEditingNaslov] = useState('');
    const [editingOpis, setEditingOpis] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isLogin, setIsLogin] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMessage, setAuthMessage] = useState('');


    const fetchTodos = useCallback(async () => {
        if (!loggedInUser) {
            setTodos([]);
            return;
        }
        try{
            const response = await fetch(`${URL_TODOS}/user/${loggedInUser.id}`);
            if (response.ok){
                const data = await response.json();
                setTodos(data);
            } else {
                setTodos([]);
            }
        }catch(error){
            console.log('Napaka pri nalaganju To-dojev:', error);
        }
    }, [loggedInUser]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos])

    const createTodo = async (e) => {
        e.preventDefault();
        if (!newTodoNaslov.trim() || !loggedInUser) return;

        const newTodo = {
            naslov: newTodoNaslov,
            opis: 'opis ni podan',
            opravljeno: false,
            user: { id: loggedInUser.id }
        }

        try{
            await fetch(URL_TODOS,{
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
            setNewTodoNaslov('');
            fetchTodos();
        }catch(error){
            console.log('Napaka pri ustvarjanju To-doja:', error);
        }
    };

    const deleteTodo = async (id) => {
        if (!loggedInUser) return;
        try{
            await fetch(`${URL_TODOS}/${id}/${loggedInUser.id}` ,{
                method: 'DELETE'
            });
            fetchTodos();
        }catch (error){
            console.log('Napaka pri brisanju To-doja:', error);
        }
    };

    const updateTodo = async (TodoID) =>{
        if (!loggedInUser) return;
        const updatedItem = {
            id: TodoID,
            naslov: editingNaslov,
            opis: editingOpis,
            opravljeno: todos.find(t => t.id === TodoID).opravljeno,
            user: { id: loggedInUser.id }
        }
        try{
            await fetch(URL_TODOS,{
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(updatedItem)
            })
            setEditingID(null);
            fetchTodos();
        }catch (error){
            console.log('Napaka pri posodabljanju To-doja:', error);
        }
    };

    const handleEdit = (todo) =>{
        setEditingID(todo.id);
        setEditingNaslov(todo.naslov);
        setEditingOpis(todo.opis);
    }

    const isOpravljeno = async (todo) =>{
        if (!loggedInUser) return;
        const updatedOpravljeno = {
            id: todo.id,
            naslov: todo.naslov,
            opis: todo.opis,
            opravljeno: true,
            user: { id: loggedInUser.id }
        }
        try{
            await fetch(URL_TODOS, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(updatedOpravljeno)
            });
            fetchTodos();
        }catch (error){
            console.log('Napaka pri posodabljanju To-doja:', error);
        }
    }

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? `${URL_USERS}/login` : `${URL_USERS}/registracija`;
        const userData = isLogin ? { email, password } : { firstName, lastName, email, password };
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.ok) {
                setAuthMessage(isLogin ? "Prijava uspešna!" : "Registracija uspešna!");
                if (isLogin) {
                    setLoggedInUser(data.user);
                }
            } else {
                setAuthMessage(data.message || "Napaka pri prijavi/registraciji.");
            }
        } catch (error) {
            setAuthMessage("Napaka pri povezavi s strežnikom.");
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setTodos([]);
    }

    const searchTodos = async () => {
        if (!loggedInUser) return;
        if (!searchQuery.trim()) return fetchTodos();
        try {
            const response = await fetch(`${URL_TODOS}/search/user/${loggedInUser.id}?naslov=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            } else {
                setTodos([]);
            }
        } catch (error) {
            console.log('Napaka pri iskanju:', error);
        }
    };

    return (
        <div className="App" style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
            <h1 className="mb-4">To-Do aplikacija</h1>

            {!loggedInUser ? (
                <UserAuth
                    isLogin={isLogin} setIsLogin={setIsLogin}
                    firstName={firstName} setFirstName={setFirstName}
                    lastName={lastName} setLastName={setLastName}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    authMessage={authMessage}
                    handleUserSubmit={handleUserSubmit}
                />
            ) : (
                // Prikaz To-Do List
                <div className="app-card-container card p-4 bg-white" style={{ maxWidth: '600px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '1rem' }}>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="card-title fs-4 text-primary">Pozdravljen, {loggedInUser.firstName} {loggedInUser.lastName}</h3>
                        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Odjava</button>
                    </div>

                    <form onSubmit={createTodo} className="input-group mb-4">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Vnesi naslov opravila"
                            value={newTodoNaslov}
                            onChange={(e) => setNewTodoNaslov(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Dodaj opravilo</button>
                    </form>

                    <div className="input-group mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Išči po naslovu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={searchTodos} className="btn btn-secondary">Išči</button>
                        <button onClick={fetchTodos} className="btn btn-outline-secondary">Pokaži vse</button>
                    </div>

                    <h2 className="text-start mb-3">Seznam opravil</h2>
                    {todos.length === 0 ? (
                        <p className="alert alert-info">Ni opravil za prikaz.</p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {todos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className={`list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3 ${todo.opravljeno ? 'bg-light text-muted' : ''}`}
                                >
                                    {editingID === todo.id ? (
                                        <div className="w-100">
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editingNaslov}
                                                onChange={(e) => setEditingNaslov(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editingOpis}
                                                onChange={(e) => setEditingOpis(e.target.value)}
                                            />
                                            <div className="btn-group">
                                                <button onClick={() => updateTodo(todo.id)} className="btn btn-success btn-sm">Shrani</button>
                                                <button onClick={() => setEditingID(null)} className="btn btn-secondary btn-sm">Prekliči</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-grow-1 me-md-3 text-start">
                                            <p className={`lead mb-0 ${todo.opravljeno ? 'text-decoration-line-through' : ''}`}>
                                                <strong>{todo.naslov}</strong>
                                            </p>
                                            <small className={`${todo.opravljeno ? 'text-decoration-line-through' : 'text-muted'}`}>
                                                Opis: {todo.opis || 'Opis ni podan'}
                                            </small>
                                        </div>
                                    )}

                                    {editingID !== todo.id && (
                                        <div className="btn-group mt-2 mt-md-0" role="group">
                                            <button onClick={() => handleEdit(todo)} className="btn btn-outline-info btn-sm">Uredi</button>
                                            <button onClick={() => deleteTodo(todo.id)} className="btn btn-outline-danger btn-sm">Izbriši</button>
                                            {!todo.opravljeno && (
                                                <button onClick={() => isOpravljeno(todo)} className="btn btn-outline-success btn-sm">Označi kot opravljeno</button>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;