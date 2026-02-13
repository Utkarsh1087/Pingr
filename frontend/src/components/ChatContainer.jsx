import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSentByMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full ring-2 ring-base-content/5 ring-offset-1 ring-offset-base-100 overflow-hidden shadow-sm">
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="chat-header mb-1.5 flex items-center gap-2 opacity-60">
                <span className="text-xs font-bold">{isSentByMe ? "You" : selectedUser.fullName.split(' ')[0]}</span>
                <time className="text-[10px] font-medium tracking-wide">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className={`chat-bubble flex flex-col p-3 rounded-2xl shadow-glass-sm max-w-[85%] sm:max-w-[70%] ${isSentByMe
                  ? "bg-primary text-primary-content"
                  : "bg-base-content/5 text-base-content backdrop-blur-sm"
                }`}>
                {message.image && (
                  <div className="relative group cursor-zoom-in">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-xl mb-2 max-h-60 w-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                {message.text && (
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {message.text}
                  </p>
                )}
              </div>

              <div className="chat-footer mt-1.5 opacity-40">
                <span className="text-[10px] font-medium uppercase tracking-tighter">
                  {isSentByMe ? "Delivered" : "Received"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
