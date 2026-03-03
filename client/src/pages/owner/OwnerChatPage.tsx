
import { useState } from "react";
import { ConversationList } from "../../components/chat/ConversationList";
import { ChatWindow } from "../../components/chat/ChatWindow";
import OwnerSidebar from "../../components/Owner/OwnerSidebar";

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

const OwnerChatPage = () => {
  const [selected, setSelected] = useState<any>(null);

  const { propertyId, userId } = useParams();
  const { conversationList } = useAuthStore();

  useEffect(() => {
  if (!conversationList.length) return;
  if (!propertyId || !userId) return;

  const match = conversationList.find(
    (c) =>
      c.otherUserId === userId &&
      c.propertyId === propertyId
  );

  if (match) {
    setSelected(match);
  }
}, [conversationList, propertyId, userId]);

//   return (
//     <div className="flex h-[80vh] border rounded-lg overflow-hidden">
      
//       {/* Conversation Sidebar */}
//       <div className="w-80 border-r overflow-y-auto">
//         <ConversationList
//           role="owner"
//           onSelect={setSelected}
//           selectedId={
//             selected
//               ? selected.otherUserId + selected.propertyId
//               : undefined
//           }
//         />
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1">
//         {selected ? (
//           <ChatWindow
//             otherUserId={selected.otherUserId}
//             otherUserName={selected.userName} 
//             otherUserModel="User"
//             propertyId={selected.propertyId}
//             propertyTitle={selected.propertyTitle}
//             role="owner"
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             Select a conversation to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );  
return (
  <div className="flex h-screen bg-gray-100">
    
    {/* Sidebar */}
    <OwnerSidebar />

    {/* Main Content */}
    <div className="flex-1 p-6">
      <div className="flex h-[85vh] bg-white border rounded-lg overflow-hidden shadow-sm">
        
        {/* Conversation Sidebar */}
        <div className="w-80 border-r overflow-y-auto">
          <ConversationList
            role="owner"
            onSelect={setSelected}
            selectedId={
              selected
                ? selected.otherUserId + selected.propertyId
                : undefined
            }
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {selected ? (
            <ChatWindow
              otherUserId={selected.otherUserId}
              otherUserName={selected.userName}
              otherUserModel="User"
              propertyId={selected.propertyId}
              propertyTitle={selected.propertyTitle}
              role="owner"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>

      </div>
    </div>
  </div>
);
};

export default OwnerChatPage;