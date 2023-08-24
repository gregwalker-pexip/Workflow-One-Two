import { registerPlugin } from '@pexip/plugin-api';

import { setPlugin } from './plugin';
import { initializeEvents } from './events';
import { initializeButtons } from './buttons';

const plugin = await registerPlugin({
  id: 'workflow-demo-plugin',
  version: 0,
});

setPlugin(plugin);

initializeEvents();
initializeButtons();
