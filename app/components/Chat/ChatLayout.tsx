"use client";
import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { ChatLayoutProps, ChatListItem } from "../../components/index";
import MessageBox from "./MessageBox";
import { Message } from "../../components/index";
import io from "socket.io-client";

const data: ChatListItem[] = [
  { id: 0, name: "Party A" },
  { id: 1, name: "Party B" },
];

const initial_msg = {
  id: null,
  text: "",
  status: "",
};

let apiURL = "https://tech-assignment-fa41facc3a1c.herokuapp.com";
let wsURL = "https://tech-assignment-fa41facc3a1c.herokuapp.com/";

// let apiURL = "http://localhost:4000";
// let wsURL = "http://localhost:4000";

const ChatLayout = ({ id }: ChatLayoutProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${apiURL}/api/messages`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const messages: Message[] = await res.json();
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    fetchMessages();

    const socket = io(wsURL);
    socket.on("connect", () => {
      console.log("WebSocket connection established");
    });
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("onUpdate", (newMessage: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessage.id ? { ...newMessage } : msg
        )
      );
    });
    socket.on("disconnect", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);
  const item = data[id];
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/5 bg-gray-100 p-4">
        <ul>
          <>
            <li
              key={item.id}
              className={`py-2 px-4 bg-white rounded-md mb-2 cursor-pointer hover:bg-gray-200`}
            >
              {item.name}
            </li>
          </>
        </ul>
      </div>
      <div className="flex flex-col w-full md:w-4/5">
        <div className="flex-grow p-4">
          <h1>Chat message</h1>
          <div className="h-full">
            {messages.map((m, i) => (
              <span key={i}>
                <MessageBox message={m} user={item.id} api={apiURL} />
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <ChatInput
            user={item.id}
            api={apiURL}
            lastUpdate={messages[messages.length - 1] || initial_msg}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
