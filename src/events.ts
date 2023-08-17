import { setConferenceAlias } from "./conference";
import { getLogger } from "./logger";
import { getCleanDisplayName, setParticipants } from "./participants";
import { getPlugin } from "./plugin";
import { InfinityParticipant } from "./types/InfinityParticipant";
import { getUser, setUser } from "./user";

import type { Plugin } from '@pexip/plugin-api';

const logger = getLogger('events.ts');

let plugin: Plugin;

interface ApplicationMessage {
  message: Record<string, unknown>
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
  setUser(participant);
};

const handleDirectMessage = (message: any): void => {
  plugin.ui.showToast({
    message: `${message.displayName}: ${message.message}`
  });
  console.log("Direct Message Received: ", message);
};

const handleParticipants = (participants: InfinityParticipant[]): void => {
  logger.error('Participants')
  logger.error(participants);
  setParticipants(participants);
};

const handleParticipantJoined = (participant: InfinityParticipant): void => {
  if (participant.uuid !== getUser().uuid) {
    const displayName = getCleanDisplayName(participant);
    const message = `${displayName} has joined call 👋`;
    plugin.ui.showToast({ message });
  }
};

const handleParticipantLeft = (participant: InfinityParticipant): void => {
  if (participant.uuid !== getUser().uuid) {
    const displayName = getCleanDisplayName(participant);
    const message = `${displayName} has left call 👋`;
    plugin.ui.showToast({ message });
  }
}

const handleApplicationMessage = (applicationMessage: ApplicationMessage): void => {

}
