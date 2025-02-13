// src/utils/telegramUtils.js

// Extracts links from message entities and plain text using regex
export function extractLinksFromEntities(msg) {
  if (!msg || !msg.message) return [];
  const links = [];
  if (msg.entities) {
    for (const entity of msg.entities) {
      if (entity.className === 'MessageEntityTextUrl') {
        links.push(entity.url);
      } else if (entity.className === 'MessageEntityUrl') {
        const urlText = msg.message.slice(entity.offset, entity.offset + entity.length);
        links.push(urlText);
      }
    }
  }
  const regex = /https?:\/\/[^\s]+/g;
  const plainTextLinks = msg.message.match(regex) || [];
  links.push(...plainTextLinks);
  const uniqueLinks = [...new Set(links)].map(link => link.trim()).filter(link => link.startsWith('http'));
  return uniqueLinks;
}

// Parses the message text into a structured JSON object
export function parseMessageToJSON(senderUsername, message, links) {
  const lines = message.split('\n');
  const jsonData = {};
  let currentKey = null;
  let currentSubArray = [];
  const linkData = {
    pumpFunLink: links.find(link => link.includes('pump.fun')),
    solscanLinks: links.filter(link => link.includes('solscan.io')),
    dexscreenerLink: links.find(link => link.includes('dexscreener.com')),
    telegramLinks: links.filter(link => link.includes('t.me') && !link.includes('/enterthetrench')),
    twitterLinks: links.filter(link => link.includes('x.com')),
    websiteLinks: links.filter(link =>
      (link.startsWith('https://www.') || link.endsWith('.com/')) &&
      !link.includes('/x.com')
    )
  };

  if (linkData.pumpFunLink) jsonData.pumpFunLink = linkData.pumpFunLink;
  if (linkData.solscanLinks.length > 0) jsonData.solscanLinks = linkData.solscanLinks;
  if (linkData.dexscreenerLink) jsonData.dexscreenerLink = linkData.dexscreenerLink;
  if (linkData.telegramLinks.length > 0) jsonData.telegramLinks = linkData.telegramLinks;
  if (linkData.twitterLinks.length > 0) jsonData.twitterLinks = linkData.twitterLinks;
  if (linkData.websiteLinks.length > 0) jsonData.websiteLinks = linkData.websiteLinks;

  lines.forEach(line => {
    if (!line.trim()) return;
    if (!line.startsWith(' ')) {
      if (currentKey && currentSubArray.length > 0) {
        jsonData[currentKey] = currentSubArray;
        currentSubArray = [];
      }
      const [key, value] = line.split(':').map(item => item.trim());
      if (key) {
        currentKey = key;
        if (value) {
          jsonData[key] = value;
          currentKey = null;
        }
      }
    } else {
      const nestedLine = line.trim();
      if (currentKey === '🦅 Dexscreener' && nestedLine.includes('Website')) {
        const websiteMatch = nestedLine.match(/https?:\/\/[^\s|]+/g);
        if (websiteMatch) {
          jsonData.websiteLinks = (jsonData.websiteLinks || []).concat(websiteMatch);
        }
      }
      if (nestedLine) currentSubArray.push(nestedLine);
    }
  });
  if (currentKey && currentSubArray.length > 0) jsonData[currentKey] = currentSubArray;
  jsonData['sourceBot'] = senderUsername;
  return jsonData;
}
