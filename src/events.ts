import { setConferenceAlias } from './conference';
import { getLogger } from './logger';
import { getCleanDisplayName, setParticipants } from './participants';
import { getPlugin } from './plugin';
import { ApplicationMessageCommand } from './types/ApplicationMessageCommand';
import { InfinityParticipant } from './types/InfinityParticipant';
import { getCurrentUser, setCurrentUser } from './user';

import type { Plugin } from '@pexip/plugin-api';
import { shareLocation, shareStatement, signStatement } from './workflowOne';

const logger = getLogger('events.ts');

let plugin: Plugin;

interface ApplicationMessage {
  id: string;
  userId: string;
  displayName: string;
  message: Record<string, unknown>;
}

export const initializeEvents = () => {
  plugin = getPlugin();
  plugin.events.authenticatedWithConference.add(handleAuthenticatedWithConference);
  plugin.events.me.add(handleMe);
  plugin.events.directMessage.add(handleDirectMessage);
  plugin.events.participants.add(handleParticipants);
  plugin.events.participantJoined.add(handleParticipantJoined);
  plugin.events.participantLeft.add(handleParticipantLeft);
  plugin.events.applicationMessage.add(handleApplicationMessage);
};

const handleAuthenticatedWithConference = (signalConference: {conferenceAlias: string}): void => {
  setConferenceAlias(signalConference.conferenceAlias);
};

const handleMe = (participant: InfinityParticipant): void => {
  setCurrentUser(participant);
};

const handleDirectMessage = (message: any): void => {
  plugin.ui.showToast({
    message: `${message.displayName}: ${message.message}`
  });
  logger.info('Direct Message Received: ', message);
};

const handleParticipants = (participants: InfinityParticipant[]): void => {
  // TODO: Before we received the participants directly, but now we receive an
  // object indicating the room and the participants. Example:
  // {
  //   id: "main",
  //   participants: [...]
  // }
  setParticipants(((participants as any).participants) as InfinityParticipant[]);
};

const handleParticipantJoined = (participant: InfinityParticipant): void => {
  if (participant.uuid !== getCurrentUser().uuid) {
    const displayName = getCleanDisplayName(participant);
    const message = `${displayName} has joined call 👋`;
    plugin.ui.showToast({ message });
  }
};

const handleParticipantLeft = (participant: InfinityParticipant): void => {
  if (participant.uuid !== getCurrentUser().uuid) {
    const displayName = getCleanDisplayName(participant);
    const message = `${displayName} has left call 👋`;
    plugin.ui.showToast({ message });
  }
}

const handleApplicationMessage = (applicationMessage: ApplicationMessage): void => {
  const message = applicationMessage.message
  switch(message.command) {
    case ApplicationMessageCommand.RequestLocation: {
      shareLocation(applicationMessage.displayName);
      break;
    }
    case ApplicationMessageCommand.ShareStatement: {
      shareStatement(applicationMessage.displayName);
      break;
    }
    case ApplicationMessageCommand.RequestSignStatement: {
      signStatement(applicationMessage.userId);
      break;
    }
  }
}
