import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

const UserSettings = () => {
  return (
    <div className='px-6 w-3/5'>
        <SharedNotificationSettings
            title="Definições do utilizador"
            subtitle="Aqui pode modificar as definições da sua conta"
        />
    </div>
  )
}

export default UserSettings