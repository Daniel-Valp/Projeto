import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const TeacherProfilePage = () => {
  return (
    <>
     <Header title='Profile' subtitle='Veja o seu perfil' />
     <UserProfile 
        path='/teacher/profile'
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
    </>
    )
}

export default TeacherProfilePage