import { SignIn } from '@clerk/nextjs'
import React from 'react'
import { dark } from "@clerk/themes"

const signinComponent = () => {
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
                    "& > div > div:nth-child(1)" : {
                        background: "#25262F",
                    },
                },
                formButtonPrimary: "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
                formFieldInput: "bg-customgreys-primarybg text-white-50 !shadow-none",
                footerActionLink: "text-primary-750 hover:text-primary-600",
            }
        }}
    />
  )
}

export default signinComponent