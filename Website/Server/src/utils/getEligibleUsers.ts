import { clerkClient } from "@clerk/clerk-sdk-node";

interface UserSettings {
  smsAlerts?: boolean;
  emailAlerts?: boolean;
  courseNotifications?: boolean;
  quizNotifications?: boolean;
  manualNotifications?: boolean;
  videoNotifications?: boolean;
  notificationFrequency?: string;
}

export const getEligibleUsers = async (
  type?: "course" | "quiz" | "video" | "manual"
) => {
  const users = await clerkClient.users.getUserList();
  console.log(`🔍 Total de usuários retornados: ${users.length}`);

  // Mapeia o tipo para a chave no settings
  const settingKeyMap: Record<string, keyof UserSettings> = {
    course: "courseNotifications",
    quiz: "quizNotifications",
    video: "videoNotifications",
    manual: "manualNotifications",
  };

  const eligibleUsers = users.filter((user) => {
    const meta = user.publicMetadata || {};
    const settings = (meta.settings || {}) as UserSettings;

    // Se passou tipo, checa apenas essa chave + emailAlerts
    if (type) {
      const settingKey = settingKeyMap[type];
      const isEligible = settings.emailAlerts === true && settings[settingKey] === true;

      if (!isEligible) {
        console.log(
          `❌ Usuário ${user.id} não elegível (emailAlerts: ${settings.emailAlerts}, ${settingKey}: ${settings[settingKey]})`
        );
      } else {
        console.log(`✅ Usuário ${user.id} elegível`);
      }
      return isEligible;
    } else {
      // Se não passou tipo, verifica se o usuário tem emailAlerts true
      // E pelo menos uma notificação ativada
      const hasAnyNotification =
        settings.courseNotifications === true ||
        settings.quizNotifications === true ||
        settings.videoNotifications === true ||
        settings.manualNotifications === true;

      const isEligible = settings.emailAlerts === true && hasAnyNotification;

      if (!isEligible) {
        console.log(
          `❌ Usuário ${user.id} não elegível (emailAlerts: ${settings.emailAlerts}, notificações: ${JSON.stringify(
            {
              courseNotifications: settings.courseNotifications,
              quizNotifications: settings.quizNotifications,
              videoNotifications: settings.videoNotifications,
              manualNotifications: settings.manualNotifications,
            }
          )})`
        );
      } else {
        console.log(`✅ Usuário ${user.id} elegível`);
      }
      return isEligible;
    }
  });

  console.log(
    "📋 Utilizadores elegíveis:",
    eligibleUsers.map((u) => u.emailAddresses[0]?.emailAddress)
  );

  return eligibleUsers;
};
