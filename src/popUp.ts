import { RPCCallPayload } from "@pexip/plugin-api"
import { getPlugin } from "./plugin"

export const popUpId = 'popUpIdWorkFlow'

export const popUpUrlSupport = 'https://au.pextest.com/sapol-local/m/sapol'
export const popUpBaseUrlFecc = 'https://au.pextest.com/sapol-fecc-web-v3/branding/plugins/sapol-plugin/fecc.web/'

const popUpDimensions = 'width=200,height=200'


export const showPromptWithPopUp = async (promptPayload: RPCCallPayload<'ui:prompt:open'>, popUpUrl: string): Promise<void> => {
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
    Object.assign(
      promptPayload, {
        opensPopup: {
          id: popUpId,
          openParams: [popUpUrl, '', popUpDimensions]
        }
      }
    );
    await plugin.ui.showPrompt(promptPayload);
  } else {
    const prompt = await plugin.ui.addPrompt(promptPayload);
    prompt.onInput.add((result) => {
      if (result === promptPayload.prompt.primaryAction) {
        window.open(popUpUrl, '', popUpDimensions);
      }
      prompt.remove();
    });
  }
}
