import { data } from './data';

export function exportData() {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jobgenie-${data.username}.json`; // replace with actual username
  link.click();
  URL.revokeObjectURL(url);
};

export function importData() {
  // Gives a prompt to insert the JSON content
  const jsonStr = prompt('Paste the JSON content here');
  if ( jsonStr ) {
    try {
      const data = JSON.parse(jsonStr);
      for ( const key in data ) {
        data[key as keyof typeof data] = undefined;
      };
      Object.assign(data, data);
    } catch (e: any) {
      alert(e.message);
    }
  }
};
