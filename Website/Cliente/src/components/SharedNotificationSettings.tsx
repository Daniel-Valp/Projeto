"use client";

import { NotificationSettingsFormData, notificationSettingsSchema } from '@/lib/schemas';
import { useUpdateUserMutation } from '@/state/api';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from 'react-hook-form';
import Header from './Header';

const SharedNotificationSettings = ({
    title = "Notificações",
    subtitle = "Muda conforme queiras receber notificações ou não"
}) => {
    const { user } = useUser();
    const [updateUser] = useUpdateUserMutation();

    // Obtém as configurações atuais do usuário
    const currentSettings = (user?.publicMetadata as { settings?: UserSettings })?.settings || {};

    // Configuração do formulário
    const methods = useForm<NotificationSettingsFormData>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            courseNotifications: currentSettings.courseNotifications || false,
            emailAlerts: currentSettings.emailAlerts || false,
            notificationFrequency: currentSettings.notificationFrequency || "daily",
        },
    });

    const onSubmit = async (data: NotificationSettingsFormData) => {
        if (!user) return;

        const updatedUser = {
            userId: user.id,
            publicMetadata: {
                ...user.publicMetadata,
                settings: {
                    ...currentSettings,
                    ...data,
                }
            }
        };

        try {
            await updateUser(updatedUser);
            console.log("Configurações atualizadas com sucesso!");
        } catch (error) {
            console.error("Falha ao atualizar os dados do utilizador: ", error);
        }
    };

    if (!user) return <div>Por favor, faça login para modificar as suas definições.</div>;

    return (
        <div className='notification-settings'>
            <Header title={title} subtitle={subtitle} />
            
            {/* Formulário para modificar as notificações */}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <label>
                        <input type="checkbox" {...methods.register("courseNotifications")} />
                        Receber notificações sobre cursos
                    </label>
                    <br />
                    <label>
                        <input type="checkbox" {...methods.register("emailAlerts")} />
                        Receber alertas por email
                    </label>
                    <br />
                    <label>
                        Frequência de notificações:
                        <select {...methods.register("notificationFrequency")}>
                            <option value="daily">Diariamente</option>
                            <option value="weekly">Semanalmente</option>
                            <option value="monthly">Mensalmente</option>
                        </select>
                    </label>
                    <br />
                    <button type="submit">Salvar Alterações</button>
                </form>
            </FormProvider>
        </div>
    );
};

export default SharedNotificationSettings;
