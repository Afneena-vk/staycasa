

import { useLocation, useParams } from 'react-router-dom';
import { ChatWindow } from '../../components/chat/ChatWindow';
import Header from '../../components/User/Header';
import Footer from '../../components/User/Footer';

const UserChatPage = () => {
  const { propertyId, ownerId } = useParams();
  const { state } = useLocation();

  if (!propertyId || !ownerId) {
    return <div className="pt-40 text-center text-gray-400">Invalid chat link.</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-8">
        <div className="max-w-3xl mx-auto h-[75vh]">
          <ChatWindow
            otherUserId={ownerId}
            otherUserName={state?.ownerName || 'Owner'}
            otherUserModel="Owner"
            propertyId={propertyId}
            propertyTitle={state?.propertyTitle || ''}
            role="user"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserChatPage;