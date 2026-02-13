import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";

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
  const { wallpaper } = useThemeStore();
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
    <div className="flex-1 flex flex-col overflow-auto relative">
      {/* Dynamic Wallpaper Background */}
      <div className={`absolute inset-0 z-0 transition-all duration-700 ${wallpaper}`} />

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10">
        {messages.map((message, idx) => {
          const isSentByMe = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSentByMe ? "chat-end" : "chat-start"} animate-message`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="chat-image avatar">
                <div className="size-9 sm:size-10 rounded-full ring-2 ring-base-content/5 ring-offset-1 ring-offset-base-100 overflow-hidden shadow-sm">
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

              <div className="chat-header mb-1 text-[10px] sm:text-xs font-bold opacity-60 flex items-center gap-2">
                {isSentByMe ? "You" : selectedUser.fullName.split(' ')[0]}
              </div>

              <div className={`chat-bubble flex flex-col p-2.5 sm:p-3 rounded-2xl shadow-glass-sm max-w-[85%] sm:max-w-[70%] group relative ${isSentByMe
                ? "bg-primary text-primary-content"
                : "bg-base-100/80 text-base-content backdrop-blur-md border border-base-content/5"
                }`}>
                {message.image && (
                  <div className="relative group/img cursor-zoom-in">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-xl mb-2 max-h-60 w-full object-cover shadow-lg transition-transform duration-300 group-hover/img:scale-[1.01]"
                    />
                  </div>
                )}
                {message.text && (
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {message.text}
                  </p>
                )}

                <div className={`flex items-center gap-1.5 mt-1 self-end opacity-50 text-[9px] sm:text-[10px] font-bold ${isSentByMe ? "text-primary-content" : "text-base-content/60"}`}>
                  {formatMessageTime(message.createdAt)}
                  {isSentByMe && (
                    <div className="transition-all duration-300 hover:scale-110">
                      <CheckCheck size={12} className="text-primary-content animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
