import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";
import {JWT} from "next-auth/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID as string,
            clientSecret: process.env.FACEBOOK_SECRET as string,
        }),
        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {

                const { email, password } = credentials as { email: string; password: string };

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    }
                });

                if (!user) {
                    throw new Error("No user found");
                }

                if(!user.password) {
                    throw new Error("No password set");
                }

                const isValid = await bcrypt.compare(password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token, user }) {
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login"
        // ... : https://next-auth.js.org/configuration/pages
    }
});