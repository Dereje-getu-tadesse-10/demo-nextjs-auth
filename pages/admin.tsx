import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Admin() {


    return (
        <>
            <h1 className="my-12 text-center">
                Admin dashboard
            </h1>
            <button className="block items-center mx-auto bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => signOut()}>Sign out</button>
            <Link href={"/"} className="block my-6 text-center underline">
                Go to home
            </Link>
        </>
    )
}