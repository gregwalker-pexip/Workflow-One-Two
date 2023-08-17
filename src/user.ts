import { InfinityParticipant } from "./types/InfinityParticipant"

let user: InfinityParticipant

export const setUser = (participant: InfinityParticipant): void => {
  user = participant;
};

export const getUser = (): InfinityParticipant => {
  return user;
};
