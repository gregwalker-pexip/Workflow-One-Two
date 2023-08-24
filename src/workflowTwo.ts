import { getConferenceAlias } from './conference';
import { getVideoFeccFormConfig } from './data/forms';
import { roomDirectory } from './data/options';
import { formFeccFailedConfig, formFeccSuccessConfig } from './data/prompts';
import { getLogger } from './logger';
import { getPlugin } from './plugin'
import { popUpBaseUrlFecc, showPromptWithPopUp } from './popUp';
import { getCurrentUser } from './user';

const logger = getLogger('workflowTwo.ts');

interface VideoFeccInput {
  feccUuid: string;
  hostPin: string;
}

export const showVideoPhonebook = async(): Promise<void> => {
  const plugin = getPlugin();

  const input = await plugin.ui.addForm({
    title: 'Video System Phonebook',
    description: 'Select a video system to call.',
    form: {
      elements: {
        directoryList: {
          name: '',
          type: 'select',
          options: roomDirectory.videoRooms,
        },
      },
      submitBtnTitle: 'Call',
    },
  });

  await input.onInput.add((formInput) => {
    const selectedRoom = formInput.directoryList;
    if (selectedRoom) {
      plugin.conference.dialOut({
        destination: selectedRoom,
        role: 'GUEST',
        protocol: 'auto'
      });
      plugin.ui.showToast({
        message: '📞 Calling ' + selectedRoom,
      });
    }
    input.remove();
  });
}

export const showVideoFecc = async (): Promise<void> => {
  const plugin = getPlugin();

  const form = await plugin.ui.addForm(getVideoFeccFormConfig());

  await form.onInput.add(async (input) => {
    const inputParams = input as unknown as VideoFeccInput;
    const feccUuid = inputParams.feccUuid;
    const hostPin = btoa(inputParams.hostPin);
    const conferenceAlias = getConferenceAlias();
    console.log(getCurrentUser())
    const displayName = getCurrentUser().displayName;

    form.remove();
    
    if (inputParams.feccUuid != '0') {
      const popUpUrl = `${popUpBaseUrlFecc}?u=${feccUuid}&c=${conferenceAlias}&n=${displayName}&x=${hostPin}`;
      logger.info('Dynamic URL -> Pop-up: ', popUpUrl);
      await showPromptWithPopUp(formFeccSuccessConfig, popUpUrl);
    } else {
      await plugin.ui.showPrompt(formFeccFailedConfig);
    }

  });
}