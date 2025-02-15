export const chatRooms = [
  {
    id: 1,
    complaint_id: "TC12022025001", 
    user_id: 1,
    applicant_whatsapp: "1234567890",
    status: "open",
    created_at: "2024-02-12T09:00:00",
    updated_at: "2024-02-12T09:00:00",
    messages: [
      {
        id: 1,
        chat_room_id: 1,
        sender_type: "user",
        sender_id: 1,
        message: "Hi, I'm Sarah from customer service. How can I assist you today?",
        message_status: "sent",
        platform: "whatsapp",
        whatsapp_message_id: "msg_123",
        created_at: "2024-02-12T09:00:00",
      },
      {
        id: 2,
        chat_room_id: 1,
        sender_type: "applicant", 
        sender_id: "TC12022025001",
        message: "Hello Sarah, I submitted a complaint last week but haven't heard back yet",
        message_status: "delivered",
        platform: "whatsapp",
        whatsapp_message_id: "msg_124",
        created_at: "2024-02-12T09:01:00",
      },
      {
        id: 3,
        chat_room_id: 1,
        sender_type: "user",
        sender_id: 1,
        message: "I apologize for the delay. Let me check your complaint status right away.",
        message_status: "sent",
        platform: "whatsapp",
        whatsapp_message_id: "msg_125",
        created_at: "2024-02-12T09:02:00",
      }
    ],
  },
  {
    id: 2,
    complaint_id: "TC12022025002",
    user_id: 2,
    applicant_whatsapp: "9876543210",
    status: "open",
    created_at: "2024-02-12T10:00:00",
    updated_at: "2024-02-12T10:00:00",
    messages: [
      {
        id: 4,
        chat_room_id: 2,
        sender_type: "applicant",
        sender_id: "TC12022025002",
        message: "Hi, I need help with my recent application",
        message_status: "read",
        platform: "whatsapp",
        whatsapp_message_id: "msg_126",
        created_at: "2024-02-12T10:00:00",
      },
      {
        id: 5,
        chat_room_id: 2,
        sender_type: "user",
        sender_id: 2,
        message: "Hello! I'd be happy to help. Could you please provide your application reference number?",
        message_status: "sent",
        platform: "whatsapp",
        whatsapp_message_id: "msg_127",
        created_at: "2024-02-12T10:01:00",
      }
    ],
  },
  {
    id: 3,
    complaint_id: "TC12022025003",
    user_id: 3,
    applicant_whatsapp: "5555555555",
    status: "closed",
    created_at: "2024-02-11T15:00:00",
    updated_at: "2024-02-11T16:00:00",
    messages: [
      {
        id: 6,
        chat_room_id: 3,
        sender_type: "applicant",
        sender_id: "TC12022025003",
        message: "Is there someone available to help with my complaint?",
        message_status: "read",
        platform: "whatsapp",
        whatsapp_message_id: "msg_128",
        created_at: "2024-02-11T15:00:00",
      },
      {
        id: 7,
        chat_room_id: 3,
        sender_type: "user",
        sender_id: 3,
        message: "Yes, I'm here to help. What seems to be the issue?",
        message_status: "read",
        platform: "whatsapp",
        whatsapp_message_id: "msg_129",
        created_at: "2024-02-11T15:01:00",
      },
      {
        id: 8,
        chat_room_id: 3,
        sender_type: "applicant",
        sender_id: "TC12022025003",
        message: "The issue has been resolved now. Thank you for your assistance!",
        message_status: "read",
        platform: "whatsapp",
        whatsapp_message_id: "msg_130",
        created_at: "2024-02-11T15:45:00",
      },
      {
        id: 9,
        chat_room_id: 3,
        sender_type: "user",
        sender_id: 3,
        message: "You're welcome! Don't hesitate to reach out if you need anything else.",
        message_status: "read",
        platform: "whatsapp",
        whatsapp_message_id: "msg_131",
        created_at: "2024-02-11T15:46:00",
      }
    ],
  },
];

export type ChatRoom = (typeof chatRooms)[number];

export type Message = {
  id: number;
  chat_room_id: number;
  sender_type: "user" | "applicant";
  sender_id: number | string;
  message: string;
  message_status: "sent" | "delivered" | "read";
  platform: string;
  whatsapp_message_id: string | null;
  created_at: string;
};

// Add this type for the selected chat state
export type SelectedChat = {
  chatRoomId: number | null;
  messageId: number | null;
};
