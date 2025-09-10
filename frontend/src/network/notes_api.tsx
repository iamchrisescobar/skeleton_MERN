import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if(response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message:" + errorMessage);
        }

    }
}

// NOTE: this can be done since front and backend are on same url. So the cookies will be sent automatically.
// If they were on different domains or subdomains we would have to include the credentials explicitly,
// which is done in the fetchData configuration
export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("api/users", {method: "GET"});
    return response.json();
}

export interface SingUpCredentials {
    usermame: string,
    email: string,
    password: string,
}

export async function signUp(credentials:SingUpCredentials): Promise<User> {
    const response = await fetchData("api/users/signup",
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    usermame: string,
    password: string,
}

export async function login(credentials:LoginCredentials): Promise<User> {
    const response = await fetchData("api/users/login",
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/api/notes", { method: "GET" });
    return response.json();    
}

export interface NoteInput{
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const respone = await fetchData("/api/notes",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return respone.json();
}

export async function updateNote(noteId:string, note: NoteInput): Promise<Note> {
    const response = await fetchData("/api/notes/" + noteId,
        {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });
    return response.json();
}

export async function deleteNote(noteId:string) {
    await fetchData("/api/notes/" + noteId, {method: "DELETE"});   
}