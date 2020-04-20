export const isSafari = () => {
  let uagent = navigator.userAgent.toLowerCase();
  return /safari/.test(uagent) && !/chrome/.test(uagent);
};
