import React, {useContext} from "react";
import { AppContext } from "../App";
import '../styles/Start.css';

export default function Start({signHandler}) {
    const {name, setName, room, setRoom} = useContext(AppContext);
    return (
        <div className="start-container">
            <h1>Secure <span> Chat Rooms </span></h1>
            <form className="submit-form" >
                <input type="text" placeholder="Enter your name*" value={name} onChange={(e)=>setName(e.target.value)}></input>
                <input type="text" placeholder="Enter the room number*" value={room} onChange={(e)=>setRoom(e.target.value)}></input>
                <button onClick={signHandler}> Join the room </button>
            </form >
        </div>
    );
}