import actions from 'enquirer/lib/combos.js'
const vimShortcuts = { h: 'left', j: 'down', k: 'up', l: 'right' };
actions.keys = { ...actions.keys, ...vimShortcuts };
export default actions
