import { Chat } from "@/components/Chat";

// La página es un contenedor a altura completa; toda la interacción vive en
// <Chat> (Client Component) que consume el endpoint de streaming /api/chat.
export default function Home() {
  return <Chat />;
}
