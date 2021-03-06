import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import {useRouter} from 'next/router'
import getRecipientEmail from "../utils/getRecipientEmail";

export default function Chat({id, users}) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)));
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);
    const redirectToChat = () => {
        router.push(`/chat/${id}`);
    }
    return (
        <Container onClick = {redirectToChat} >
            {recipient ? <UserAvatar src = {recipient.photoURL} />
            : <UserAvatar>{recipientEmail[0]}</UserAvatar> }
            <p>{recipientEmail}</p>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    :hover{
        background-color:#e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;

