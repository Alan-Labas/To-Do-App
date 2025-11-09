# To-Do App

Enostavna spletna aplikacija za upravljanje opravil (To-Do list), zgrajena z **React (frontend)** in **Spring Boot (backend)**.

---

## 1. Dokumentacija za razvijalce

###  Struktura projekta
```
To-Do-App/
│
├── To-Do-app-backend/          # Backend (Java Spring Boot)
│   ├── ToDoAppApplication.java # Glavni zagon aplikacije
│   ├── controllers/            # REST kontrolerji (ToDoController, UserController)
│   ├── repositories/           # Spring Data JPA repozitoriji (ToDoRepository, UserRepository)
│   ├── models/                 # Entitete (ToDo, User)
│   └── application.properties  # Nastavitve baze in strežnika
│
└── frontend/                   # Frontend (React)
    ├── App.js                  # Glavna React komponenta
    ├── index.js                # Vstopna točka aplikacije
    ├── TodoApp.js              # Upravljanje opravil (dodajanje, prikaz, brisanje)
    ├── UserAuth.js             # Avtentikacija uporabnikov
    └── userRegister.js         # Registracija uporabnikov
```

### Tehnologije
- **Frontend:** React - react@19.2.0 (JavaScript, JSX)
- **Backend:** Java Spring Boot (v3.5.6)
- **Baza:** MySQL - mysql  Ver 9.3.0 for macos15.4 on arm64 (Homebrew)
- **Orodja:** Maven, npm - v10.9.2, node - v22.14.0
- **API komunikacija:** REST API (JSON)

###  Standardi kodiranja
- Imena razredov v **CamelCase** (`ToDoController`, `UserRepository`)
- Spremenljivke v **lowerCamelCase**
- Vse funkcije komentirane z Javadoc (v backendu)
- Logika ločena v sloje: **Controller → Repository → Model**

---

## 2. Navodila za nameščanje

### Zahteve
- **Java 17+**
- **Maven**
- **Node.js in npm**
- **Git**

### Namestitev korak za korakom

1. **Kloniraj repozitorij:**
   ```bash
   git clone https://github.com/Alan-Labas/To-Do-App.git
   ```

2. **Namesti in zaženi backend:**
   ```bash
   cd To-Do-app-backend
   mvn clean install
   mvn spring-boot:run
   ```
   Backend se zažene na: `http://localhost:8080`

3. **Namesti in zaženi frontend:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
   Frontend se zažene na: `http://localhost:3000`

4. **Uporabi aplikacijo:**
   - Odpri `http://localhost:3000`
   - Registriraj novega uporabnika
   - Dodaj, uredi ali izbriši opravila

---

## 3. Navodila za razvijalce (prispevanje)

Če želiš prispevati k projektu:

1. **Forkaj repozitorij**
2. **Ustvari novo vejo** za svojo funkcionalnost:
   ```bash
   git checkout -b feature/nova-funkcionalnost
   ```
3. **Naredi spremembe** in jih commitaš:
   ```bash
   git add .
   git commit -m "Dodana nova funkcionalnost"
   ```
4. **Pošlji spremembe:**
   ```bash
   git push origin feature/nova-funkcionalnost
   ```
5. **Ustvari pull request** na GitHubu.

---

## 4. Dodatne informacije
- Avtor: **Alan Labaš**
- Verzija: `1.0.0`
- Licenca: MIT
