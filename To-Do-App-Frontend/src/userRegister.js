import react, {useState, useEffect} from 'react';

const URL = "http://localhost:8080/api/todos";

function userRegister(){
    const [user, setUser] = useState([])

    const fetchUser = async () => {
        try{
            const response = await fetch(URL);
            if (response.ok){
                const data = await response.json();
                setUser(data);
            }
        }catch (error){
            console.log('Napaka pri nalaganju uporabnikov:', error);
        }
    }

    const createUser = async (e) => {
        e.preventDefault();

        try {
            await fetch(URL,{
                method: 'POST',
                headers:{ 'content-type': 'application/json'},
                body: JSON.stringify(user)
                });
        }catch (error){
            console.log('Napaka pri registraciji:', error)
        }
    }
}