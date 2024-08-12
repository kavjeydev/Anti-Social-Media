'use client';

import Image from "next/image"
import styles from "./navbar.module.css"
import Link from "next/link"
import SignIn from "./sign-in";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar(){
    //init user
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const authHelper = onAuthStateChangedHelper((user) => {
            setUser(user);
        })

        return () => authHelper();
    })

    return(
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={50} height={50} className={styles.logo} src="/shuffle-logo-t.svg" alt="Shuffle Logo"/>
            </Link>

            <SignIn user={user}/>
        </nav>
    );
}