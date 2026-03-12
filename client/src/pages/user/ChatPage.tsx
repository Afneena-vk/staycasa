
import { useLocation, useParams } from 'react-router-dom';
import { ChatWindow } from '../../components/chat/ChatWindow';

const UserChatPage = () => {
  const { propertyId, ownerId } = useParams();
  const { state } = useLocation();

  if (!propertyId || !ownerId) {
    return (
      <div className="pt-40 text-center text-gray-400">Invalid chat link.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 pt-28 pb-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Chat Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden h-[75vh] flex flex-col border border-gray-200">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Chat with {state?.ownerName || 'Owner'}
              </h2>
              {state?.propertyTitle && (
                <p className="text-sm text-gray-500 mt-1">
                  Regarding: {state.propertyTitle}
                </p>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 p-4 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default UserChatPage;




// import { useLocation, useParams } from 'react-router-dom';
// import { ChatWindow } from '../../components/chat/ChatWindow';
// // import Header from '../../components/User/Header';
// // import Footer from '../../components/User/Footer';

// const UserChatPage = () => {
//   const { propertyId, ownerId } = useParams();
//   const { state } = useLocation();

//   if (!propertyId || !ownerId) {
//     return <div className="pt-40 text-center text-gray-400">Invalid chat link.</div>;
//   }

//   return (
//     <>
//       {/* <Header /> */}
//       <div className="min-h-screen bg-gray-50 pt-28 pb-15 px-4 sm:px-6 md:px-10">
//          <div className="max-w-7xl mx-auto">
//         <div className="max-w-3xl mx-auto h-[75vh]">
//           <ChatWindow
//             otherUserId={ownerId}
//             otherUserName={state?.ownerName || 'Owner'}
//             otherUserModel="Owner"
//             propertyId={propertyId}
//             propertyTitle={state?.propertyTitle || ''}
//             role="user"
//           />
//         </div>
//       </div>
//       </div>
//       {/* <Footer /> */}
//     </>
//   );
// };

// export default UserChatPage;