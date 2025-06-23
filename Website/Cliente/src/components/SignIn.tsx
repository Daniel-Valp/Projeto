"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import React from "react";
import { useSearchParams } from "next/navigation";

const SignInComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const signUpUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=true`
    : "/signup";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=true`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/";
    }
    return "/";
  };

  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "",       // Remove sombra
          card: "",          // Remove background customizado
          footer: {},        // Sem cor customizada no footer
          formFieldLabel: "", // Remove cor customizada
          formButtonPrimary: "", // Remove background customizado do botão
          formFieldInput: "", // Remove input com cor customizada
          footerActionLink: "hidden", // Esconde link de "Sign up" (se quiser manter)
        },
      }}
      forceRedirectUrl={getRedirectUrl()}
      routing="hash"
      afterSignOutUrl="/"
    />
  );
};

export default SignInComponent;
