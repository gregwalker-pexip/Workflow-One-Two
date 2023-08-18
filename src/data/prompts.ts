import type { RPCCallPayload } from '@pexip/plugin-api'

export const geolocationPromptConfig: RPCCallPayload<'ui:prompt:open'> = {
  title: 'Location Sharing Request',
  description:
    'Please accept this location request for evidence validation purposes.',
  prompt: {
    primaryAction: 'Accept',
    secondaryAction: 'Dismiss',
  },
};

export const formPromptConfig: RPCCallPayload<'ui:prompt:open'> = {
  title: 'Popup Confirmation',
  description: 'Please confirm access camera control',
  prompt: {
    primaryAction: 'Access',
    secondaryAction: 'Close',
  }
};
