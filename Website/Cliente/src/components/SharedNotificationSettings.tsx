"use client";

import {
  NotificationSettingsFormData,
  notificationSettingsSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUserMutation } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./CustomFormField";
import { Button } from "@/components/ui/button";

const SharedNotificationSettings = ({
  title = "Notification Settings",
  subtitle = "Manage your notification settings",
}: SharedNotificationSettingsProps) => {
  const { user } = useUser();
  const [updateUser] = useUpdateUserMutation();

  const currentSettings =
    (user?.publicMetadata as { settings?: UserSettings })?.settings || {};

  const methods = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      courseNotifications: currentSettings.courseNotifications || false,
      emailAlerts: currentSettings.emailAlerts || false,
      smsAlerts: currentSettings.smsAlerts || false,
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
        },
      },
    };

    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.error("Falha ao atualizar as definições do utilizador, por: ", error);
    }
  };

  if (!user) return <div>Por favor faça login para poder modificar as definições.</div>;

  return (
    <div className="notification-settings">
      <Header title={title} subtitle={subtitle} />
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="notification-settings__form"
        >
          <div className="notification-settings__fields">
            <CustomFormField
              name="courseNotifications"
              label="Notificações para cursos"
              type="switch"
            />
            {/* <CustomFormField
              name="QuizzesNotifications"
              label="Notificações para Quizzes"
              type="switch"
            />
            <CustomFormField
              name="ManuaisNotifications"
              label="Notificações para Manuais"
              type="switch"
            /> */}
            <CustomFormField
              name="emailAlerts"
              label="Alerta por emails"
              type="switch"
            />
            

            <CustomFormField
              name="notificationFrequency"
              label="Frequencia de avisos"
              type="select"
              options={[
                { value: "immediate", label: "Imediata" },
                { value: "daily", label: "Diaria" },
                { value: "weekly", label: "Semanal" },
              ]}
            />
          </div>

          <Button type="submit" className="notification-settings__submit">
            Atualizar definições.
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SharedNotificationSettings;