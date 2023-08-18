import { getVideoFeccFormConfig, videoFeccFormSameDomainConfig } from './data/forms';
import { roomDirectory } from './data/options';
import { getLogger } from './logger';
import { getPlugin } from './plugin'

// TODO: Only for first compilation
const feccListOptions: any[] = [];
const conferenceAlias = '';
const selfName = '';

const logger = getLogger('workflowTwo.ts');

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

  let urlPop;
  const input = await plugin.ui.addForm(getVideoFeccFormConfig());

  await input.onInput.add((formInput) => {
    var feccSelection = formInput.feccList;
    var hostPIN = formInput.hostPIN;

    if (feccSelection && feccSelection !== '0') {
      urlPop =
        'https://au.pextest.com/sapol-fecc-web-v3/branding/plugins/sapol-plugin/fecc.web/?u=' +
        feccSelection +
        '&c=' +
        conferenceAlias +
        '&n=' +
        selfName +
        '&x=' +
        btoa(hostPIN);

      console.log('Dynamic URL -> Pop-up: ', urlPop);
    }

    input.remove();
  });
}