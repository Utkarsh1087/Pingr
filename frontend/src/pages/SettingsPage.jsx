import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-24 max-w-5xl">
      <div className="space-y-8">
        <div className="flex flex-col gap-1 px-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text text-transparent">
            Appearance
          </h2>
          <p className="text-sm font-medium text-base-content/40">Personalize your chat experience with a custom theme</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 px-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300
                ${theme === t ? "bg-primary/10 ring-2 ring-primary shadow-glass-sm" : "hover:bg-base-content/5"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-10 w-full rounded-xl overflow-hidden shadow-inner" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5 bg-base-100">
                  <div className="rounded-lg bg-primary"></div>
                  <div className="rounded-lg bg-secondary"></div>
                  <div className="rounded-lg bg-accent"></div>
                  <div className="rounded-lg bg-neutral"></div>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest truncate w-full text-center ${theme === t ? "text-primary" : "text-base-content/50"}`}>
                {t}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            Live Preview
          </h3>
          <div className="rounded-3xl border border-base-content/5 overflow-hidden bg-base-100/40 backdrop-blur-xl shadow-glass p-6 md:p-10">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-3xl shadow-glass overflow-hidden border border-base-content/5">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-base-content/5 bg-base-100/50 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                        <span className="text-primary font-bold text-sm">JD</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">John Doe</h3>
                        <div className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-green-500" />
                          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-6 min-h-[220px] max-h-[220px] overflow-y-auto bg-base-100/30">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[85%] rounded-2xl p-3.5 shadow-glass-sm font-medium text-sm
                          ${message.isSent
                            ? "bg-primary text-primary-content"
                            : "bg-base-content/5 text-base-content backdrop-blur-sm"}
                        `}
                      >
                        <p>{message.content}</p>
                        <time
                          className={`
                            text-[10px] mt-1.5 font-bold uppercase tracking-widest block
                            ${message.isSent ? "text-primary-content/50" : "text-base-content/30"}
                          `}
                        >
                          12:00 PM
                        </time>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-content/5 bg-base-100/50 backdrop-blur-md">
                  <div className="flex gap-3 bg-base-content/5 p-1 rounded-2xl">
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none flex-1 py-2 px-3 text-sm placeholder:text-base-content/30"
                      placeholder="Type your message..."
                      value="Hey Pingr!"
                      readOnly
                    />
                    <button className="size-10 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-glass-sm hover:scale-105 transition-all">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
