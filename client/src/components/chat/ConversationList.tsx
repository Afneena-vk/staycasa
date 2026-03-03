import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  role: 'user' | 'owner';
  onSelect: (item: any) => void;
  selectedId?: string;
}

export const ConversationList = ({ role, onSelect, selectedId }: Props) => {
  const { conversationList, fetchConversationList, messageLoading } = useAuthStore();

  useEffect(() => {
    fetchConversationList(role);
  }, [role]);

  if (messageLoading) return <p className="p-4 text-sm text-gray-400">Loading conversations...</p>;
  if (!conversationList.length) return <p className="p-4 text-sm text-gray-400">No conversations yet.</p>;

  return (
    <div className="flex flex-col divide-y">
      {conversationList.map((conv) => (
        <div
          key={`${conv.otherUserId}_${conv.propertyId}`}
          onClick={() => onSelect(conv)}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
            selectedId === conv.otherUserId + conv.propertyId ? 'bg-blue-50' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold shrink-0">
            {conv.propertyTitle?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{conv.propertyTitle}</p>
            <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.content || '📷 Image'}</p>
          </div>
          {conv.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
              {conv.unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};