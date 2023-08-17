import { InfinityParticipant } from './types/InfinityParticipant';

let participantsList: InfinityParticipant[] = [];

export const setParticipants = (participants: InfinityParticipant[]) => {
  participantsList = participants;
};

export const getParticipants = (): InfinityParticipant[] => {
  return participantsList;
};

export const getCleanDisplayName = (participant: InfinityParticipant): string => {
  return participant.displayName?.replace('sip:','') ?? 'Unknown participant'
};