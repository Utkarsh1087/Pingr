import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Copy, MoreVertical, Clock, Trash2, Heart, Smile } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  const messages = useChatStore((state) => state.messages);
  const getMessages = useChatStore((state) => state.getMessages);
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);
  const isTruthMode = useChatStore((state) => state.isTruthMode);
  const toggleReaction = useChatStore((state) => state.toggleReaction);
  const deleteMessage = useChatStore((state) => state.deleteMessage);

  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const [isDeleting, setIsDeleting] = useState(null); // stores messageId
  const [showReactionPicker, setShowReactionPicker] = useState(null); // stores messageId
  const wallpaper = useThemeStore((state) => state.wallpaper);
  const messageEndRef = useRef(null);

  const lastMessage = messages[messages.length - 1];
  const getMoodGlow = () => {
    if (!lastMessage) return "";
    const senderId = lastMessage.senderId._id || lastMessage.senderId;
    if (senderId === authUser._id) return "";
    const text = lastMessage.text?.toLowerCase() || "";
    if (text.includes("angry") || text.includes("hate") || text.includes("stop")) return "shadow-[0_0_100px_rgba(239,68,68,0.2)] ring-1 ring-error/20";
    if (text.includes("love") || text.includes("sweet") || text.includes("heart")) return "shadow-[0_0_100px_rgba(236,72,153,0.2)] ring-1 ring-pink-500/20";
    if (text.includes("happy") || text.includes("wow") || text.includes("excited")) return "shadow-[0_0_100px_rgba(234,179,8,0.2)] ring-1 ring-yellow-500/20";
    if (text.includes("sad") || text.includes("cry") || text.includes("sorry")) return "shadow-[0_0_100px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/20";
    return "";
  };



  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied!");
  };

  const handleRoast = (text) => {
    const roasts = [
      `"Actually, I'm kind of busy" - Translation: I'm staring at a wall and you're not invited.`,
      `Bro really sent "${text}" and thought he ate.`,
      `This message has the same energy as a low battery notification.`,
      `I've seen more depth in a puddle than in this statement.`,
      `Sending "${text}" is a choice. A bad one, but a choice.`
    ];
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    toast(roast, { icon: "🔥", duration: 5000, style: { background: "#333", color: "#fff", borderRadius: "15px" } });
  };

  const handleCompliment = (text) => {
    const compliments = [
      `Absolute King energy in this message.`,
      `Legendary communication skills activated.`,
      `"${text}" - Pure Shakespearean excellence.`,
      `The vibe of this message is immaculate.`,
      `You dropped this: 👑`
    ];
    const comp = compliments[Math.floor(Math.random() * compliments.length)];
    toast(comp, { icon: "💖", duration: 5000, style: { background: "#fff", color: "#e91e63", border: "1px solid #e91e63", borderRadius: "15px" } });
  };

  useEffect(() => {
    getMessages(selectedUser._id, !!selectedUser.members);

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
    <div className={`flex-1 flex flex-col overflow-auto relative transition-all duration-700 ${getMoodGlow()}`}>
      {/* Dynamic Wallpaper Background */}
      <div className={`absolute inset-0 z-0 transition-all duration-700 ${wallpaper}`} />

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10">
        {messages.map((message, idx) => {
          const senderId = message.senderId._id || message.senderId;
          const isSentByMe = senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSentByMe ? "chat-end" : "chat-start"} animate-message group/chat`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              onMouseEnter={() => setHoveredMessageId(message._id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className="chat-image avatar">
                <div className={`size-9 sm:size-10 rounded-full ring-2 ${isTruthMode && !isSentByMe ? "ring-neutral grayscale" : "ring-base-content/5"} ring-offset-1 ring-offset-base-100 overflow-hidden shadow-sm`}>
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || "/avatar.png"
                        : (isTruthMode ? "/avatar.png" : message.senderId.profilePic || "/avatar.png")
                    }
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="chat-header mb-1 text-[10px] sm:text-xs font-bold opacity-60 flex items-center gap-2">
                {isSentByMe ? "You" : (isTruthMode ? "Anonymous Shadow" : (message.senderId.fullName?.split(' ')[0] || "User"))}
              </div>

              <div className={`chat-bubble flex flex-col p-2.5 sm:p-3 rounded-2xl shadow-glass-sm max-w-[85%] sm:max-w-[70%] group relative ${isSentByMe
                ? "bg-primary text-primary-content"
                : (isTruthMode ? "bg-neutral text-neutral-content border-neutral-content/10" : "bg-base-100/80 text-base-content backdrop-blur-md border border-base-content/5")
                }`}>

                {/* Floating Quick Actions */}
                {hoveredMessageId === message._id && (
                  <div className={`absolute -top-10 ${isSentByMe ? "right-0" : "left-0"} flex items-center gap-1 p-1 bg-base-100/90 backdrop-blur-xl border border-base-content/10 rounded-xl shadow-glass-sm animate-in fade-in slide-in-from-bottom-2 duration-200 z-20`}>
                    <div className="flex items-center gap-0.5 border-r border-base-content/10 pr-1 mr-1">
                      {['👍', '❤️', '😂', '😡'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(message._id, emoji)}
                          className="px-1 hover:scale-125 transition-transform text-xs"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => handleCopy(message.text)} className="p-1.5 hover:bg-base-content/10 rounded-lg text-base-content/60 hover:text-primary transition-all">
                      <Copy size={14} />
                    </button>
                    {!message.isDeletedForEveryone && (
                      <button onClick={() => setIsDeleting(message._id)} className="p-1.5 hover:bg-base-content/10 rounded-lg text-base-content/60 hover:text-error transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button onClick={() => handleRoast(message.text)} className="p-1.5 hover:bg-base-content/10 rounded-lg text-base-content/60 hover:text-error transition-all" title="Roast">
                      🔥
                    </button>
                    <button onClick={() => handleCompliment(message.text)} className="p-1.5 hover:bg-base-content/10 rounded-lg text-base-content/60 hover:text-pink-500 transition-all" title="Compliment">
                      💖
                    </button>
                  </div>
                )}

                {/* Deletion Dialog Overlay */}
                {isDeleting === message._id && (
                  <div className="absolute inset-0 z-30 bg-base-100/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-2 gap-2 animate-in fade-in zoom-in-95">
                    <p className="text-[10px] font-black uppercase opacity-60">Delete Message?</p>
                    <div className="flex gap-2">
                      <button onClick={() => { deleteMessage(message._id, "me"); setIsDeleting(null); }} className="px-2 py-1 bg-base-content/5 hover:bg-base-content/10 rounded-lg text-[9px] font-bold">For Me</button>
                      {isSentByMe && (
                        <button onClick={() => { deleteMessage(message._id, "everyone"); setIsDeleting(null); }} className="px-2 py-1 bg-error/10 hover:bg-error/20 text-error rounded-lg text-[9px] font-bold">For All</button>
                      )}
                      <button onClick={() => setIsDeleting(null)} className="px-2 py-1 hover:bg-base-content/5 rounded-lg text-[9px] font-bold">Cancel</button>
                    </div>
                  </div>
                )}

                {message.image && (
                  <div className="relative group/img cursor-zoom-in">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-xl mb-2 max-h-60 w-full object-cover shadow-lg transition-transform duration-300 group-hover/img:scale-[1.01]"
                    />
                  </div>
                )}

                {message.unlockAt && new Date(message.unlockAt) > new Date() ? (
                  <div className="flex flex-col items-center gap-2 py-4 px-6 bg-base-content/5 rounded-xl border border-dashed border-base-content/20">
                    <div className="p-2 rounded-full bg-base-content/5 animate-pulse">
                      <Clock size={24} className="opacity-40" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-center">
                      Time Capsule<br />
                      Unlocks {new Date(message.unlockAt).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <>
                    {message.text && (
                      <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium ${message.isDeletedForEveryone ? "italic opacity-40 text-xs" : (isTruthMode && !isSentByMe ? "font-mono tracking-tighter" : "")}`}>
                        {message.text}
                      </p>
                    )}
                  </>
                )}

                {/* Reactions Display */}
                {message.reactions?.length > 0 && (
                  <div className={`absolute -bottom-3 ${isSentByMe ? "right-2" : "left-2"} flex -space-x-1 hover:space-x-0.5 transition-all`}>
                    {message.reactions.map((r, i) => (
                      <div key={i} className="bg-base-100 ring-2 ring-primary/20 rounded-full py-0.5 px-1.5 text-[10px] shadow-sm flex items-center gap-1 group/react">
                        {r.emoji}
                      </div>
                    ))}
                  </div>
                )}

                <div className={`flex items-center gap-1.5 mt-1 self-end opacity-50 text-[9px] sm:text-[10px] font-bold ${isSentByMe ? "text-primary-content" : "text-base-content/60"}`}>
                  {formatMessageTime(message.createdAt)}
                  {isSentByMe && (
                    <div className="flex items-center">
                      {message.seenBy?.length > 0 ? (
                        <CheckCheck size={14} className="text-blue-400 stroke-[3px]" />
                      ) : (
                        <Check size={14} className="opacity-80" />
                      )}
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
