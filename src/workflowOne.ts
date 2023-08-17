import { ChecklistElement } from '@pexip/plugin-api';
import { getLogger } from './logger';
import { getCleanDisplayName, getParticipants } from './participants';
import { getPlugin } from './plugin';
import { getUser } from './user';

const logger = getLogger('workflowOne.ts');

const selectedParticipant = '';

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
  
  logger.info('Checklist Options: ', getParticipantsOptions());

  const input = await plugin.ui.addForm({
    title: 'Manage Participant',
    description: 'Select participant for interaction.',
    form: {
      elements: {
        participant: {
          name: 'Participant:',
          type: 'select',
          options: getParticipantsOptions(),
        },
        conferenceOptions: {
          name: 'Meeting Options:',
          type: 'checklist',
          options: [
            { id: 'spotlightUser', label: 'Spotlight User', checked: true },
            {
              id: 'spotlightSelf',
              label: 'Spotlight Self (secondary)',
              checked: true,
            },
            { id: 'focusLayout', label: 'Focussed Layout (1:1)' },
            { id: 'lockConference', label: 'Lock Meeting' },
          ],
        },
      },
      submitBtnTitle: 'Apply',
    }
  });
  input.onInput.add((config) => {
    configureConference(config as ConferenceConfig)
  })
}

export const requestLocation = (): void => {
  const plugin = getPlugin();
  plugin.conference.sendApplicationMessage({
    payload: { pexCommand: 'requestGeolocation' },
    participantUuid: selectedParticipant,
  });
  plugin.ui.showToast({ message: 'Location request pending 📌' });
}

export const shareStatement = (): void => {
  const plugin = getPlugin();
  logger.info('Share document link');

  plugin.conference.sendMessage({
    payload:
      'Your Statement: ' + 'https://cms.docs.gov.au/doc-123456789.pdf/',
  });
  plugin.ui.showToast({
    message: 'Document link has been shared via chat 💬',
  });

  plugin.conference.sendApplicationMessage({
    payload: { pexCommand: 'sharingStatement' },
    participantUuid: selectedParticipant,
  });
}

export const approveStatement = () => {
  const plugin = getPlugin();
  logger.info('Request statement approval');

  plugin.conference.sendApplicationMessage({
    payload: { pexCommand: 'requestSignStatement' },
    participantUuid: selectedParticipant,
  });
  plugin.ui.showToast({
    message: 'Approval request sent...',
  });
}

export const wrapUpMeeting = async (): Promise<void> => {
  const plugin = getPlugin();
  const input = await plugin.ui.addForm({
    title: 'Meeting Wrap-up',
    description: 'What would you like to do?',
    form: {
      elements: {
        actionList: {
          name: 'Action List:',
          type: 'select',
          options: [
            { id: 'endMeeting', label: 'End Meeting' },
            { id: 'leaveMeeting', label: 'Leave Meeting' },
            { id: 'somethingElse', label: 'Something Else Perhaps' },
          ],
        },
      },
      submitBtnTitle: 'Apply',
    }
  })
}

const getParticipantsOptions = (): ChecklistElement['options'] => {
  return getParticipants().map((participant) => ({
    id: participant.uuid,
    label: getCleanDisplayName(participant)
  }));
};

const configureConference = (config: ConferenceConfig): void => {
  const plugin = getPlugin();

  plugin.conference.spotlight({
    participantUuid: config.participant,
    enable: config.conferenceOptions.spotlightUser
  });

  plugin.conference.spotlight({
    participantUuid: getUser().uuid,
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