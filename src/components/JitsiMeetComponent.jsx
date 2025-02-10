import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiMeetComponent = ({ roomName, user, jwtToken }) => {
  return (
    <JitsiMeeting
      domain="localhost:8443"
      roomName={roomName}
      jwt={jwtToken} // Pass the JWT token for authentication
      configOverwrite={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
      }}
      interfaceConfigOverwrite={{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      }}
      userInfo={{
        displayName: user.username,
      }}
      onApiReady={(externalApi) => {
        // You can store externalApi for custom commands
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '100vh';
        iframeRef.style.width = '100%';
      }}
    />
  );
};

export default JitsiMeetComponent;
