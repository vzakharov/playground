import { appData } from './data';

export function downloadData() {
  const dataStr = JSON.stringify(appData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jobgenie-${appData.username}.json`; // replace with actual username
  link.click();
  URL.revokeObjectURL(url);
}
