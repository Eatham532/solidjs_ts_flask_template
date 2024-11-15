import {Component, createResource, createSignal, onMount, Show} from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import * as v1 from "./api/v1"

import {get_api_request, get_server_event_source, post_api_request} from "./conn"

async function fetchUsers(): Promise<v1.Users> {
    let users = await get_api_request("/users");
    if (users) { return users }
    return []
}

async function addUser(username:string, password:string) {
    await post_api_request("/add_user", {"username": username, "password": password})
        .catch((e) => console.log(`Error! ${e}`))
}

const App: Component = () => {
    const [users, usersResource] = createResource(fetchUsers);
    const [index, setIndex] = createSignal(0);
    const [userInput, setUserInput] = createSignal("");
    const [passInput, setPassInput] = createSignal("");
    const [sent, setSent] = createSignal(false)

    const [hello, setHello] = createSignal(0)

    onMount(() => {
        const event_source = get_server_event_source();

        event_source.onmessage = (event) => {
            console.log(event)
            setHello(hello() + 1)
        }

        return () => event_source.close()
    })


    return (
        <div class={styles.App}>
            <header class={styles.header}>
                <img src={logo} class={styles.logo} alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    class={styles.link}
                    href="https://github.com/solidjs/solid"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Solid
                </a>
                <div>
                    <Show when={!sent()} fallback={
                        <div>
                            <p>Information Sent</p>
                            <button onClick={() => window.location.reload()}>reload</button>
                        </div>
                    }>
                        <input placeholder={"USERNAME"} value={userInput()} onInput={(i) => setUserInput(i.target.value)}/>
                        <input placeholder={"PASSWORD"} value={passInput()} onInput={(i) => setPassInput(i.target.value)}/>
                        <button onSubmit={e => e.preventDefault()}
                                onClick={() => {
                                    console.log(`U: ${userInput()} P: ${passInput()}`);
                                    addUser(userInput(), passInput()).then(() => console.log("Sent"))
                                    setSent(true);
                                }}>Submit
                        </button>
                    </Show>
                </div>
                <div style={{"padding": "40px"}}>
                    <Show when={!users.loading} fallback={"Loading..."}>
                        Name: {users()?.at(index())?.username}<br/>
                        Password: {users()?.at(index())?.password}
                    </Show>
                </div>
                <button onClick={() => {
                    if (users()?.length == index() + 1) {
                        setIndex(0)
                    } else {
                        setIndex(index() + 1)
                    }
                }}>Index: {index() + 1}</button>
                <p>I've been sent hello {hello()} times</p>
            </header>
        </div>
    );
};

export default App;
