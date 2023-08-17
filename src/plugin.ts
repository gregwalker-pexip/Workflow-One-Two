import { Plugin } from '@pexip/plugin-api';

let pluginInst: Plugin;

export const setPlugin = (plugin: Plugin) => {
  pluginInst = plugin;
};

export const getPlugin = (): Plugin => {
  return pluginInst;
};