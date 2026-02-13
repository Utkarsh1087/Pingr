import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, sendTyping, sendStopTyping, selectedUser } = useChatStore();
  const typingTimeoutRef = useRef(null);

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
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full border-t border-base-content/5 glass-effect">
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
            <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
              <p className="text-[10px] text-white font-bold uppercase tracking-widest">Remove</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-base-content/5 rounded-2xl p-1.5 focus-within:bg-base-content/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <button
            type="button"
            className={`flex items-center justify-center size-10 rounded-xl transition-all duration-200
                     ${imagePreview ? "bg-emerald-500/10 text-emerald-500" : "hover:bg-base-content/10 text-base-content/40 hover:text-base-content"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} className={imagePreview ? "animate-bounce" : ""} />
          </button>

          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-base-content/30 h-10 px-2"
            placeholder="Write your message..."
            value={text}
            onChange={handleTextChange}
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
            ? "bg-primary text-primary-content hover:scale-105 active:scale-95 shadow-primary/25"
            : "bg-base-content/5 text-base-content/20 cursor-not-allowed"
            }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={24} className={text.trim() || imagePreview ? "translate-x-0.5 -translate-y-0.5" : ""} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
