let alias: string;

export const setConferenceAlias = (conferenceAlias: string) => {
  alias = conferenceAlias;
};

export const getConferenceAlias = (): string => {
  return alias;
};
