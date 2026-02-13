import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [unlockDelay, setUnlockDelay] = useState(0); // in minutes
  const fileInputRef = useRef(null);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const sendTyping = useChatStore((state) => state.sendTyping);
  const sendStopTyping = useChatStore((state) => state.sendStopTyping);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const isTruthMode = useChatStore((state) => state.isTruthMode);
  const typingTimeoutRef = useRef(null);

  const getUnlockAt = () => {
    if (unlockDelay === 0) return null;
    return new Date(Date.now() + unlockDelay * 60000).toISOString();
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (selectedUser) {
      sendTyping(selectedUser._id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(selectedUser._id);
      }, 2000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      if (selectedUser) sendStopTyping(selectedUser._id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        unlockAt: getUnlockAt(),
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setUnlockDelay(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleScreenshotChaos = () => {
    toast("👀 Someone just screenshotted the chat...", {
      icon: "📸",
      duration: 4000,
      position: "top-center",
      style: { background: "#ff4b4b", color: "#white", fontWeight: "bold", borderRadius: "15px" }
    });
  };

  const isGroupChat = !!selectedUser?.members;

  return (
    <div className={`p-4 w-full border-t border-base-content/5 glass-effect ${isTruthMode && isGroupChat ? "bg-neutral text-neutral-content" : ""}`}>
      {imagePreview && (
        <div className="mb-4 flex items-center gap-3">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-2xl border-2 border-primary/20 shadow-glass"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-base-100
              flex items-center justify-center shadow-lg border border-base-content/10 
              text-error hover:scale-110 active:scale-95 transition-all"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {unlockDelay > 0 && (
        <div className="mb-3 px-4 py-1.5 bg-primary/10 rounded-full inline-flex items-center gap-2 border border-primary/20 animate-pulse">
          <Clock size={12} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Unlocking in {unlockDelay} min</span>
          <button onClick={() => setUnlockDelay(0)} className="hover:text-error"><X size={12} /></button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className={`flex-1 flex items-center gap-2 bg-base-content/5 rounded-2xl p-1.5 focus-within:bg-base-content/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 ${isTruthMode && isGroupChat ? "bg-white/10" : ""}`}>
          <button
            type="button"
            className={`flex items-center justify-center size-10 rounded-xl transition-all duration-200
                     ${imagePreview ? "bg-emerald-500/10 text-emerald-500" : "hover:bg-base-content/10 text-base-content/40 hover:text-base-content"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} className={imagePreview ? "animate-bounce" : ""} />
          </button>

          <button
            type="button"
            className={`flex items-center justify-center size-10 rounded-xl transition-all duration-200
                     ${unlockDelay > 0 ? "bg-primary/20 text-primary" : "hover:bg-base-content/10 text-base-content/40 hover:text-base-content"}`}
            onClick={() => setUnlockDelay(unlockDelay === 0 ? 1 : (unlockDelay === 1 ? 5 : (unlockDelay === 5 ? 60 : 0)))}
            title="Time Capsule"
          >
            <Clock size={20} />
          </button>

          <input
            type="text"
            className={`flex-1 bg-transparent border-none outline-none text-sm placeholder:text-base-content/30 h-10 px-2 ${(isTruthMode && isGroupChat) ? "placeholder:text-white/30" : ""}`}
            placeholder={(isTruthMode && isGroupChat) ? "Send anonymous message..." : "Write your message..."}
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) handleScreenshotChaos();
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className={`size-12 rounded-2xl flex items-center justify-center shadow-glass transition-all duration-300 ${text.trim() || imagePreview
            ? (isTruthMode && isGroupChat ? "bg-white text-black" : "bg-primary text-primary-content hover:scale-105 shadow-primary/25")
            : "bg-base-content/5 text-base-content/20 cursor-not-allowed"
            }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} className={text.trim() || imagePreview ? "translate-x-0.5" : ""} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
