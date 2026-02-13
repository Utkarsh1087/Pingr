import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-base-100/50 transition-colors duration-500 overflow-hidden">
      <div className="flex items-center justify-center pt-16 h-screen">
        <div className="bg-base-100/60 backdrop-blur-xl w-full h-full shadow-glass border-t border-base-content/5 transition-all duration-500">
          <div className="flex h-full">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
