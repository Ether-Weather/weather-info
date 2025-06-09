export const parseWeatherXml = (xmlString, targetCategory) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const items = xmlDoc.getElementsByTagName('item');
    for (let item of items) {
      const category = item.getElementsByTagName('category')[0]?.textContent;
      if (category === targetCategory) {
        return item.getElementsByTagName('obsrValue')[0]?.textContent;
      }
    }
    return null;
  };