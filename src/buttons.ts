import { getPlugin } from './plugin';
import {
  workFlowOneButtonConfig,
  workFlowTwoButtonConfig,
  promptButtonConfig,
  WorkflowOneButtonId,
  WorkflowTwoButtonId
} from './data/buttons';
import {
  approveStatement,
  manageParticipant,
  requestLocation,
  shareStatement,
  wrapUpMeeting
} from './workflowOne';
import { formPromptConfig, formPromptSameDomainConfig } from './data/prompts';
import { popUpDimensions, popUpId, popUpUrl } from './data/popUp';
import { showVideoFecc, showVideoPhonebook } from './workflowTwo';

type ButtonSignalButtonId = {
  buttonId: string;
}

type ButtonSignalParticipantUuid = {
  participantUuid: string;
}

type ButtonSignal =
  | ButtonSignalButtonId
  | ButtonSignalParticipantUuid

export const initializeButtons = async (): Promise<void> => {
  const plugin = getPlugin();

  const workflowOneButton = await plugin.ui.addButton(workFlowOneButtonConfig);
  const workflowTwoButton = await plugin.ui.addButton(workFlowTwoButtonConfig);
  const promptButton = await plugin.ui.addButton(promptButtonConfig);

  workflowOneButton.onClick.add(handleWorkflowOne);
  workflowTwoButton.onClick.add(handleWorkflowTwo);
  promptButton.onClick.add(handlePrompt);

  window.plugin.popupManager.add(popUpId, (input) => {
    if (input.action === formPromptConfig.prompt.primaryAction) {
      return true;
    }
    return false;
  });
};

const handleWorkflowOne = (buttonSignal: ButtonSignal): void => {
  const buttonId = (buttonSignal as ButtonSignalButtonId).buttonId;
  switch (buttonId) {
    case WorkflowOneButtonId.ManageParticipant: {
      manageParticipant();
      break;
    }
    case WorkflowOneButtonId.RequestLocation: {
      requestLocation();
      break;
    }
    case WorkflowOneButtonId.ShareStatement: {
      shareStatement();
      break;
    }
    case WorkflowOneButtonId.ApproveStatement: {
      approveStatement();
      break;
    }
    case WorkflowOneButtonId.WrapUpMeeting: {
      wrapUpMeeting();
      break;
    }
    default: {
      throw new Error('Unknown button ID');
    }
  }
};

const handleWorkflowTwo = (buttonSignal: ButtonSignal): void => {
  const buttonId = (buttonSignal as ButtonSignalButtonId).buttonId;
  switch (buttonId) {
    case WorkflowTwoButtonId.VideoPhonebook: {
      showVideoPhonebook();
      break;
    }
    case WorkflowTwoButtonId.VideoFecc: {
      showVideoFecc();
      break;
    }
    default: {
      throw new Error('Unknown button ID');
    }
  }
};

const handlePrompt = async (): Promise<void> => {
  const plugin = getPlugin();

  // Check if the plugin is served from the same domain as Web App 3
  let sameDomain: boolean = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    parent.document
  } catch (e) {
    sameDomain = false
  }
  if (sameDomain) {
    await plugin.ui.showPrompt(formPromptSameDomainConfig);
  } else {
    const prompt = await plugin.ui.addPrompt(formPromptConfig);
    prompt.onInput.add((result) => {
      if (result === formPromptConfig.prompt.primaryAction) {
        window.open(popUpUrl, '', popUpDimensions);
      }
      prompt.remove();
    });
  }
};
