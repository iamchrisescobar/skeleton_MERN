import { Container } from "react-bootstrap";
import LoginModal from "./components/LogInModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import styles from "./styles/NotesPage.module.css";
import { useEffect, useState } from "react";
import { User } from "./models/user";
import * as NotesAPI from "./network/notes_api";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "./components/NotesPageLoggedOutView";

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
        <div>
            <NavBar
                loggedInUser={loggedInUser}
                onLoginClicked={() => { setShowLoginModal(true) }}
                onSignUpClicked={() => { setShowSignUpModal(true) }}
                onLogoutSuccessfull={() => { setLoggedInUser(null) }}
            />
            <Container className={styles.notesPage}>
                <>
                { loggedInUser
                    ? <NotesPageLoggedInView />
                    : <NotesPageLoggedOutView />
                }
                </>
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
    );
}

export default App;