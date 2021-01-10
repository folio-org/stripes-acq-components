/* eslint-disable no-console */

const warn = console.warn;
const error = console.error;
const blacklist = [
  /"defaultRichTextElements" was specified/,
];
const blacklist_errors = [
  /Missing message:/,
];

export default function turnOffWarnings() {
  console.warn = function (...args) {
    if (blacklist.some(rx => rx.test(args[0]))) {
      return;
    }
    warn.apply(console, args);
  };

  console.error = function (...args) {
    if (blacklist_errors.some(rx => rx.test(args[0]))) {
      return;
    }
    error.apply(console, args);
  };
}
