'use strict';

module.exports = ({ file, options, env }) => ({
  plugins: {
    'posthtml-bem': {
      elemPrefix: '__',
      modPrefix: '--',
      modDlmtr: '--',
    },
  },
});
