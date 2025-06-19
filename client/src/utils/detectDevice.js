export function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Browser detection
  if (/Chrome/.test(ua) && !/Edge|Edg|OPR/.test(ua)) browser = "Chrome";
  else if (/Edg|Edge/.test(ua)) browser = "Microsoft Edge";
  else if (/MSIE|Trident/.test(ua)) browser = "Internet Explorer";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/OPR/.test(ua)) browser = "Opera";

  // OS detection
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "MacOS";
  else if (/Linux/.test(ua)) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

  // Device type
  if (/Mobi|Android|iPhone|iPad|iPod/.test(ua)) device = "Mobile";

  return { browser, os, device };
}