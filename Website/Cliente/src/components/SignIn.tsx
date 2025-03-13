"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";

const SignInComponent = () => {
    const searchParams = useSearchParams();
    const { user } = useUser();
    const courseId = searchParams.get("id");

    

    return (
        <SignIn
            appearance={{
                baseTheme: dark,
                elements: {
                    rootBox: "flex justify-center items-center py-5",
                    card: "bg-customgreys-secondarybg w-full shadow",
                    footer: {
                        background: "#25262F",
                        padding: "0rem 2.5rem",
                        "& > div > div:nth-child(1)": {
                            background: "#25262F",
                        },
                    },
                    formButtonPrimary: "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
                    formFieldInput: "bg-customgreys-primarybg text-white-50 !shadow-none",
                    footerActionLink: "text-primary-750 hover:text-primary-600",
                },
            }}
            signUpUrl="/signup" // Redireciona para a página de cadastro
        />
    );
};

export default SignInComponent;
