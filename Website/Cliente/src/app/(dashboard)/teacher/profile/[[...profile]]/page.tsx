import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const TeacherProfilePage = () => {
  return (
    <div className="p-8"> {/* 👈 padding adicionado aqui */}
      <Header title="Perfil" subtitle="Modifique as informações do seu perfil aqui" />
      <UserProfile 
        path="/teacher/profile"
        routing="path"
        appearance={{
          elements: {
            scrollBox: "bg-customgreys-darkgrey",
            navbar: {
              "& > div:nth-child(1)": {
                background: "none",
              }
            }
          }
        }}
      />
    </div>
  )
}

export default TeacherProfilePage
