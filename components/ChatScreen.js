import { Avatar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { InsertEmoticon } from "@material-ui/icons";
import MicIcon from '@material-ui/icons/Mic';
import { useState, useRef } from "react";
import firebase from 'firebase';
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from 'timeago-react';



export default function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const router = useRouter();
    const endOfMessageRef = useRef(null);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)));
    const [messageSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', "asc")
    );
    const showMessages = () => {
        if(messageSnapshot)
        {
            return messageSnapshot.docs.map(message => (
                <Message 
                    key = { message.id}
                    user = {message.data().user }
                    message = {
                        {
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime()
                        }
                    }
                />
            ))
                
        }else{
            return JSON.parse(messages).map(message => (
                <Message 
                    key = { message.id}
                    user = {message.user }
                    message = {message}
                /> 
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block:"start",
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            },
           {merge: true}
        );
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });
        setInput('');
        scrollToBottom();

    }
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);
    return (
        <Container>
            <Header>
                {recipient ? <Avatar src = {recipient.photoURL} />
                : <Avatar>{recipientEmail[0]}</Avatar> }
                <HeaderInfo>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p> Last active: {" "}
                        {recipient?.lastSeen?.toDate()? ( 
                            <TimeAgo dateTime={recipient?.lastSeen?.toDate()} />
                        ): "Unavailable" }
                        </p>
                    ): <p>Loading Last Seen</p>}
                </HeaderInfo>
                <HeaderIcon>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcon>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref = {endOfMessageRef} />
            </MessageContainer>
            <InputContainer>
                <InsertEmoticon/>
                <Input value = {input} onChange={ (e) => setInput(e.target.value) } />
                <button type = "submit" onClick={sendMessage} disabled = {!input} hidden >Send</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

const Container = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color:white;
    z-index: 100;
`;
const Input = styled.input`
    flex: 1;
    font-size:20px ;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin: 0px 15px 0px 15px;
    
`;


const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 11px;
    background-color:white;
    height:80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    border-left:1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
    margin-left:15px;
    flex: 1;
    >h3{
        margin-bottom: 3px;
    }
    >p{
        color: gray;
        font-size:14px
    }
`;

const HeaderIcon = styled.div`
`;


const MessageContainer = styled.div`
    padding:30px;
    height: 90vh;
    background-color:#e5ded8;
    overflow: scroll;
`;
const EndOfMessage = styled.div`
    margin-bottom: 40px;
`;
