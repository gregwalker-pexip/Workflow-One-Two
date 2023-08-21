import { getLogger } from './logger';
import { getPlugin } from './plugin';
import { getCurrentUser, getSelectedUser, setSelectedUser } from './user';
import { getManageParticipantForm, statementFormConfig, wrapUpMeetingFormConfig } from './data/forms';
import { ApplicationMessageCommand } from './types/ApplicationMessageCommand';
import { geolocationPromptConfig } from './data/prompts';
import { getParticipants } from './participants';

const logger = getLogger('workflowOne.ts');

interface ConferenceConfig {
  participant: string;
  conferenceOptions: {
    spotlightUser: boolean;
    spotlightSelf: boolean;
    focusLayout: boolean;
    lockConference: boolean;
  }
}

export const manageParticipant = async (): Promise<void> => {
  const plugin = getPlugin();
  
  logger.info('Checklist Options: ', getManageParticipantForm());

  const form = await plugin.ui.addForm(getManageParticipantForm());
  form.onInput.add((config) => {
    if (Object.keys(config).length !== 0) {
      const confConfig = config as unknown as ConferenceConfig;
      const user = getParticipants().find((participant) => participant.uuid === confConfig.participant);
      if (user != null) {
        setSelectedUser(user);
        configureConference(confConfig);
      }
    }
    form.remove();
  })
}

export const requestLocation = (): void => {
  const plugin = getPlugin();
  plugin.conference.sendApplicationMessage({
    payload: {
      command: ApplicationMessageCommand.RequestLocation
    },
    participantUuid: getSelectedUser().uuid,
  });
  plugin.ui.showToast({ message: 'Location request pending 📌' });
}

export const requestShareStatement = (): void => {
  const plugin = getPlugin();
  logger.info('Share document link');

  plugin.conference.sendMessage({
    payload:
      'Your Statement: https://cms.docs.gov.au/doc-123456789.pdf/',
  });
  plugin.ui.showToast({
    message: 'Document link has been shared via chat 💬',
  });

  plugin.conference.sendApplicationMessage({
    payload: { 
      command: ApplicationMessageCommand.ShareStatement
    },
    participantUuid: getSelectedUser().uuid,
  });
}

export const requestSignStatement = (): void => {
  const plugin = getPlugin();
  logger.info('Request statement approval');

  plugin.conference.sendApplicationMessage({
    payload: {
      command: ApplicationMessageCommand.RequestSignStatement
    },
    participantUuid: getSelectedUser().uuid,
  });
  plugin.ui.showToast({
    message: 'Approval request sent...',
  });
}

export const wrapUpMeeting = async (): Promise<void> => {
  const plugin = getPlugin();
  const form = await plugin.ui.addForm(wrapUpMeetingFormConfig);
}

export const shareLocation = async(senderDisplayName: string): Promise<void> => {
  const plugin = getPlugin();

  void plugin.ui.showToast({
    message: `${senderDisplayName} has requested your location 📌`,
  });

  const input = await plugin.ui.showPrompt(geolocationPromptConfig);

  if (input === 'Accept') {
    try {
      const position = await getLocation();
      const link = getGoogleMapsLink(position);
      plugin.conference.sendMessage({
        payload: `📌 Location (~${position.coords.accuracy.toFixed()}m): ${link}`
      });
    } catch (e) {
      logger.error(e);
      plugin.conference.sendMessage({
        payload: '📌 Location not available',
      });
    }
  } else {
    //On dismiss button
    plugin.conference.sendMessage({
      payload: '📌 Location request denied',
    });
  }
}

export const shareStatement = (senderDisplayName: string): void => {
  const plugin = getPlugin();

  plugin.ui.showToast({
    message: `${senderDisplayName} has shared statement via chat 💬`,
  });
  plugin.conference.sendMessage({
    payload: '🧾 User has received statement link for review',
  });
}

export const signStatement = async(senderUuid: string): Promise<void> => {
  const plugin = getPlugin();

  plugin.ui.showToast({
    message: `${getCurrentUser().displayName}, please approve statement.`,
  });
  const input = await plugin.ui.addForm(statementFormConfig);

  input.onInput.add((formInput) => {
    plugin.conference.sendMessage({
      payload: '✅ Statement has been signed: ' + formInput.name,
    });
    plugin.conference.sendMessage({
      payload: '✅ Statement has been signed: ' + formInput.name,
      participantUuid: senderUuid,
    });
    input.remove();
  });
}

const configureConference = (config: ConferenceConfig): void => {
  logger.info(config);
  const plugin = getPlugin();

  plugin.conference.spotlight({
    participantUuid: config.participant,
    enable: config.conferenceOptions.spotlightUser
  });

  plugin.conference.spotlight({
    participantUuid: getCurrentUser().uuid,
    enable: config.conferenceOptions.spotlightSelf
  });

  const layout = config.conferenceOptions.focusLayout ? '1:0' : '1:7';
  plugin.conference.setLayout({
    transforms: { layout }
  });

  plugin.conference.lock({
    lock: config.conferenceOptions.lockConference
  });
}

const getLocation = async (): Promise<GeolocationPosition> => {
  if ('geolocation' in navigator) {
    const position: GeolocationPosition = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
    return position;
  } else {
    throw new Error('Location not available');
  }
}

const getGoogleMapsLink = (position: GeolocationPosition): string => {
  return `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;
}
