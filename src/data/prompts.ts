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

export const formFeccSuccessConfig: RPCCallPayload<'ui:prompt:open'> = {
  title: 'FECC connected',
  description: 'Please confirm access camera control',
  prompt: {
    primaryAction: 'Open',
  }
};

export const formFeccFailedConfig: RPCCallPayload<'ui:prompt:open'> = {
  title: 'FECC failed',
  description: 'Cannot detect any camera',
  prompt: {
    primaryAction: 'Close',
  }
};
