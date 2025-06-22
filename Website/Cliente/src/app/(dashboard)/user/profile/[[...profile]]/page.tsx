import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const UserProfilePage = () => {
  return (
    <div className="px-6 py-6"> {/* 👈 padding aplicado aqui */}
      <Header title="Perfil" subtitle="Modifique as informações do seu perfil aqui." />
      <UserProfile 
        path="/user/profile"
        routing="path"
        appearance={{
          elements: {
            scrollBox: "bg-customgreys-darkgrey",
            navbar: {
              "& > div:nth-child(1)": {
                background: "none",
              },
            },
          },
        }}
      />
    </div>
  )
}

export default UserProfilePage
