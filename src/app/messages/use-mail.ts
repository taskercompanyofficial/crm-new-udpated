import { atom, useAtom } from "jotai"
import { ChatRoom, SelectedChat } from "./data"

const selectedChatAtom = atom<SelectedChat>({
  chatRoomId: null,
  messageId: null,
})

export function useSelectedChat() {
  return useAtom(selectedChatAtom)
}
