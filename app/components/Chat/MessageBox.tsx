"use client";
import { useState } from "react";
import { MessageProps } from "../../components/index";

const MessageBox: React.FC<MessageProps> = ({ message, user, api }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const [showAlert, setShowAlert] = useState(false);

  const isEditable = user == message.updated_by;
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    console.log("Edited text:", editedText);
    try {
      const res = await fetch(`${api}/api/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editedText,
          updated_by: user,
          status: "Pending",
          id: message.id,
        }),
      });

      if (res.status === 409) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await res.json();
      console.log("Response:", result);
    } catch (error) {
      console.error("Error submitting amount:", error);
    }

    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedText(message.text);
    setIsEditing(false);
  };

  return (
    <div
      className={`mt-3 ${
        isEditable ? "bg-blue-500" : "bg-gray-300"
      } rounded-lg p-2 my-1 max-w-md ${isEditable ? "mr-auto" : "ml-auto"}`}
    >
      {isEditing ? (
        <div className="flex">
          <input
            type="number"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="ml-2 flex items-center">
            <button
              onClick={handleSaveClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <p className="text-white">{message.text}</p>
            {isEditable && message.status === "Pending" ? (
              <button
                onClick={handleEditClick}
                className="absolute top-0 right-0 text-white hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            ) : null}
          </div>
          <p className="text-xs text-gray-500 text-right">
            {new Date(message.updated_at).toDateString()},
            {new Date(message.updated_at).toTimeString().split(" ")[0]}
          </p>
        </>
      )}
      <div
        style={{
          display: showAlert ? "block" : "none",
          backgroundColor: "red",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <p>{"Latest update Available"}</p>
      </div>
    </div>
  );
};

export default MessageBox;
