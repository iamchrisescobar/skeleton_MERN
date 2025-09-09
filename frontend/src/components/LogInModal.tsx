import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css"


interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccesful: (user: User) => void,
}

const LoginModal = ({onDismiss, onLoginSuccesful}: LoginModalProps) => {
    
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginCredentials>();

    async function onSubmit(credentials:LoginCredentials) {
        try {
            const user = await NotesApi.login(credentials);
            onLoginSuccesful(user);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }
    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Log In
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField 
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.usermame}
                    />
                    <TextInputField 
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}>
                        Log In
                    </Button>
                </Form>
                
            </Modal.Body>
        </Modal>
     );
}
 
export default LoginModal;