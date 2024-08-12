'use client';

import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";
import { Sign } from "crypto";
import Upload from "./upload";

interface SignInProps {
    user: User | null
}

export default function SignIn({ user }:SignInProps){


    return(
        <Fragment>
            { user ? (
                <><Upload /><button className={styles.signin} onClick={signOut}>
                    Sign Out
                </button></>
            ) : (
                <button className={styles.signin} onClick={signInWithGoogle}>
                    Sign In
                </button>
            )
            }


        </Fragment>
    )
}