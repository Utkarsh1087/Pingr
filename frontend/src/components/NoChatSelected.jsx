import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/10 backdrop-blur-sm">
      <div className="max-w-md text-center space-y-8">
        {/* Icon Display */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div
              className="size-20 rounded-3xl bg-primary/15 flex items-center
             justify-center shadow-glass ring-1 ring-primary/20 animate-bounce transition-transform duration-500 group-hover:scale-110"
            >
              <MessageSquare className="size-10 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 size-6 bg-primary rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl animate-pulse" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-base-content to-base-content/60 bg-clip-text text-transparent">
            Welcome to Pingr
          </h2>
          <p className="text-base-content/50 font-medium leading-relaxed">
            Select a conversation from the sidebar to start chatting and stay connected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
