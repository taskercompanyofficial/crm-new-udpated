import { Mail } from "./components/mail";
import { chatRooms } from "./data";

export default async function MessagePage() {
  const accounts = [
    {
      label: "Alicia Koch",
      email: "alicia@example.com",
      icon: "👩",
    },
  ];

  return <Mail accounts={accounts} mails={chatRooms} navCollapsedSize={4} />;
}
