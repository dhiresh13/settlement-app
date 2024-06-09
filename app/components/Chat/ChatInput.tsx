"use client";
import React, { useEffect, useState } from "react";
import { ChatInputProps, Message } from "../../components/index";

const ChatInput: React.FC<ChatInputProps> = ({ user, api, lastUpdate }) => {
  const [message, setMessage] = useState<string>("");
  const [isSettled, setIsSettled] = useState<boolean>(false);
  const [isinputDisabled, setIsinputDisabled] = useState<boolean>(false);
  const [isApprovalDisabled, setIsApprovalDisabled] = useState<boolean>(false);

  const { status, id, text } = lastUpdate;

  useEffect(() => {
    if (status === "Settled") {
      setIsSettled(true);
    }
    if (status === "Objection" || typeof status === undefined) {
      setIsApprovalDisabled(true);
      setIsinputDisabled(false);
    }
    if (status === "Pending") {
      setIsinputDisabled(true);
      setIsApprovalDisabled(false);
    }
  }, [status]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${api}/api/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          updated_by: user,
          status: "Pending",
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result: Message = await res.json();
      console.log("Message submitted successfully:", result);
      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleSettlement = async () => {
    try {
      const res = await fetch(`${api}/api/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `The party accepts the offer of ${text}`,
          status: "Settled",
          id: id,
          updated_by: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result: Message = await res.json();
      console.log("Message approved successfully:", result);
      setIsSettled(true);
    } catch (error) {
      console.error("Error approving message:", error);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`${api}/api/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `The party rejects the offer of ${text}`,
          status: "Objection",
          id: id,
          updated_by: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await res.json();
      console.log("Message rejected successfully:", result);
    } catch (error) {
      console.error("Error rejecting message:", error);
    }
  };

  return (
    <div className="flex items-center justify-evenly">
      {!isSettled && user !== 1 ? (
        <>
          <input
            type="number"
            value={message}
            disabled={isinputDisabled}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={isinputDisabled}
            className={`${
              isinputDisabled ? `bg-gray-500` : `bg-blue-500 hover:bg-blue-700`
            } text-white font-bold py-2 px-4 rounded-md ml-2`}
          >
            Send
          </button>
        </>
      ) : !isSettled ? (
        <>
          <button
            disabled={typeof status === "undefined"}
            onClick={handleSettlement}
            className={`${
              isApprovalDisabled
                ? `bg-gray-500`
                : `bg-blue-500 hover:bg-blue-700`
            } text-white font-bold py-2 px-4 rounded-md mr-2`}
          >
            Approve
          </button>
          <button
            disabled={typeof status === "undefined"}
            onClick={handleReject}
            className={`${
              isApprovalDisabled
                ? `bg-gray-500`
                : `bg-blue-500 hover:bg-blue-700`
            } text-white font-bold py-2 px-4 rounded-md mr-2`}
          >
            Reject
          </button>
        </>
      ) : isSettled ? (
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded">
          Settlement has been successful
        </div>
      ) : null}
    </div>
  );
};

export default ChatInput;
