import { InfinityParticipant } from './types/InfinityParticipant'

let currentUser: InfinityParticipant;
let selectedUser: InfinityParticipant;

export const setCurrentUser = (participant: InfinityParticipant): void => {
  currentUser = participant;
};

export const getCurrentUser = (): InfinityParticipant => {
  return currentUser;
};

export const setSelectedUser = (participant: InfinityParticipant): void => {
  selectedUser = participant;
}

export const getSelectedUser = (): InfinityParticipant => {
  return selectedUser;
}
