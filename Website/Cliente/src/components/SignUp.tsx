"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import React from "react";
import { useSearchParams } from "next/navigation";

const SignUpComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=false`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/cursos";
    }
    return "/user/cursos";
  };

  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "",           // Sem sombra customizada
          card: "",              // Sem background customizado
          footer: {},            // Sem cor customizada no footer
          formFieldLabel: "",    // Sem cor customizada no label
          formButtonPrimary: "", // Botão com estilo padrão
          formFieldInput: "",    // Input com estilo padrão
          footerActionLink: "",  // Link com estilo padrão (remova se quiser esconder)
        },
      }}
      signInUrl={signInUrl}
      forceRedirectUrl={getRedirectUrl()}
      routing="hash"
      afterSignOutUrl="/"
    />
  );
};

export default SignUpComponent;
