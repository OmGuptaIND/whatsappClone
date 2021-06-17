import { Button } from '@material-ui/core';
import Head from 'next/head';
import styled from 'styled-components';
import { auth, provider } from '../firebase';

export default function Login() {
    const handleSignIn = () =>{
        auth.signInWithPopup(provider).catch(alert);
    }
    return (
        <Container>
            <Head>
                <title>Login Page</title>
            </Head>
            <LoginContainer>
                <Logo src = 'logo.png' />
                <Button onClick = {handleSignIn} variant = 'outlined' >Sign To login with Google</Button>
            </LoginContainer>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    place-items: center;
    height:100vh;
    background: whitesmoke;
`;

const LoginContainer = styled.div`
    padding:20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color:white;
    border-radius: 10px;
    box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.img`
    object-fit: cover;
`;