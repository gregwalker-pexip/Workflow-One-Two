import { FormPayload } from '@pexip/plugin-api';
import { getFeccParticipantsOptions, getParticipantsOptions } from './options';

export const statementFormConfig: FormPayload = {
  title: 'Statement Approval',
  description: 'I confirm the provided statement as being accurate and true.',
  form: {
    elements: {
      name: {
        name: '',
        placeholder: 'Your Full Legal Name',
        type: 'text',
        isOptional: false,
      },
      agreement: {
        name: '',
        type: 'checklist',
        options: [
          {
            id: 'falseStatementCheck',
            label:
              'I understand the consequences of making a false police report.',
          },
        ],
        isOptional: false,
      },
    },
    submitBtnTitle: 'Submit',
  },
};

export const wrapUpMeetingFormConfig: FormPayload = {
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
};

export const getVideoFeccFormConfig =(): FormPayload => ({
  title: 'Far End Camera Control',
  description: 'Control video systems remote camera',
  form: {
    elements: {
      feccList: {
        name: 'Select video system (FECC enabled):',
        type: 'select',
        options: getFeccParticipantsOptions(),
      },
      hostPIN: {
        name: 'Host PIN (if required):',
        type: 'password',
      },
    },
    submitBtnTitle: 'Select',
  }
})

export const getManageParticipantForm = (): FormPayload => ({
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
