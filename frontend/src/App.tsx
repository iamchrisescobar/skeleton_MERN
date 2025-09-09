import { useEffect, useState } from "react";
import LoginModal from "./components/LogInModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as NotesAPI from "./network/notes_api";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css"

function App() {

    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await NotesAPI.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);
    // MAIN RENDER
    // --------------------------------------------------------------------------
    return (
        <BrowserRouter>
            <div>
                <NavBar
                    loggedInUser={loggedInUser}
                    onLoginClicked={() => { setShowLoginModal(true) }}
                    onSignUpClicked={() => { setShowSignUpModal(true) }}
                    onLogoutSuccessfull={() => { setLoggedInUser(null) }}
                />
                <Container className={styles.pageContainer}>
                    <Routes>
                        <Route 
                        path='/'
                        element={<NotesPage loggedInUser={loggedInUser} />}
                        />
                        <Route 
                        path='/privacy'
                        element={<PrivacyPage />}
                        />
                        <Route 
                        path='/*'
                        element={<NotFoundPage />}
                        />
                    </Routes>
                </Container>
                {showSignUpModal &&
                        <SignUpModal
                            onDismiss={() => { setShowSignUpModal(false) }}
                            onSignUpSuccesful={(user) => { 
                            setLoggedInUser(user);
                            setShowSignUpModal(false);
                            }}
                        />
                }
                {showLoginModal &&
                    <LoginModal
                        onDismiss={() => { setShowLoginModal(false) }}
                        onLoginSuccesful={(user) => {
                            setLoggedInUser(user);
                            setShowLoginModal(false);
                        }}
                    />
                }
            </div>
        </BrowserRouter>
    );
}

export default App;