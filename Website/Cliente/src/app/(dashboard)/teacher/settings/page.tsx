import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

const TeacherSettings = () => {
  return (
    <div className='w-3/5 p-6'> {/* 👈 padding adicionado aqui */}
      <SharedNotificationSettings
        title="Definições do Professor"
        subtitle="Aqui pode modificar as definições da sua conta"
      />
    </div>
  )
}

export default TeacherSettings;
