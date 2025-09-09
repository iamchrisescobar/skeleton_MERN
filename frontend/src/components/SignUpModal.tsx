import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SingUpCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css"

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccesful: (user: User) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccesful}: SignUpModalProps) => {
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SingUpCredentials>();
    
    async function onSubmit(credentials:SingUpCredentials) {
        try {
            const newUser = await NotesApi.signUp(credentials);
            onSignUpSuccesful(newUser);
        } catch (error) {
            alert(error);
            console.error(error);
        }
        
    }
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
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
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="example@email.com"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
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
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignUpModal;