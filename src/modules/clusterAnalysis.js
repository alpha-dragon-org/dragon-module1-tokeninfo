// // src/modules/clusterAnalysis.js
// import puppeteer from 'puppeteer';

// export async function fetchWalletListFromBubblemaps(parsedJSON) {
//   let browser = null;
//   let dataReceived = false;
//   try {
//     const pumpAddress = parsedJSON.pumpFunLink 
//       ? parsedJSON.pumpFunLink.split('/').pop()
//       : null;
//     if (!pumpAddress) {
//       console.log('[WARNING] No pump address found in message for Bubblemaps');
//       return null;
//     }
//     const bubblemapUrl = `https://app.bubblemaps.io/sol/token/${pumpAddress}`;
//     console.log('[INFO] Navigating to Bubblemaps:', bubblemapUrl);
    
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     const page = await browser.newPage();
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
//       '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
//     );
//     await page.goto(bubblemapUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    
//     // Wait for the Wallet List button or timeout after 5 seconds
//     const walletListButtonSelector = '#app > div > div > div.graph-view > div:nth-child(6) > div.buttons-row__right-side > div:nth-child(2)';
//     const buttonExists = await Promise.race([
//       page.waitForSelector(walletListButtonSelector, { timeout: 45000 }),
//       new Promise(resolve => setTimeout(() => resolve(null), 5000))
//     ]);
    
//     if (!buttonExists) {
//       console.log('[ERROR] Wallet List button not found within timeout.');
//       return null;
//     }
    
//     dataReceived = true;
//     console.log('[INFO] Clicking Wallet List button...');
//     await page.click(walletListButtonSelector);
    
//     console.log('[INFO] Waiting for wallet list...');
//     const walletListItemSelector = '.wallets-list ul li';
//     await page.waitForSelector(walletListItemSelector, { timeout: 45000 });
    
//     const walletsData = await page.evaluate(() => {
//       const results = [];
//       const walletItems = document.querySelectorAll('.wallets-list ul li');
//       walletItems.forEach((item) => {
//         const nameSpan = item.querySelector('.wallets-list__name');
//         if (!nameSpan) return;
//         const rankElem = nameSpan.querySelector('b');
//         const rankText = rankElem ? rankElem.textContent.trim() : '';
//         const rank = rankText.replace('#', '');
//         const textParts = nameSpan.textContent.split(' - ').map(s => s.trim());
//         let name = textParts.length >= 2 ? textParts[1] : '';
//         const percentElem = item.querySelector('b.wallets-list__percent');
//         const percentageText = percentElem ? percentElem.textContent.trim() : '';
//         const percentage = parseFloat(percentageText.replace('%', '') || 0);
//         let color = '';
//         const bubbleSpan = item.querySelector('.wallets-list__bubble');
//         if (bubbleSpan) {
//           const styleString = bubbleSpan.getAttribute('style') || '';
//           const match = styleString.match(/background-color:\s*([^;]+)/i);
//           if (match && match[1]) color = match[1].trim();
//         }
//         // Only add wallets without the exchange icon
//         const isExchangeIconPresent = item.querySelector('.material-icons.wallets-list__special-icon') ? 'Yes' : 'No';
//         if (isExchangeIconPresent === 'No') {
//           results.push({ rank, name, percentage, color, isExchangeIconPresent });
//         }
//       });
//       return results;
//     });
    
//     // Group wallets by color and calculate cluster percentages
//     const clusters = {};
//     walletsData.forEach(wallet => {
//       const color = wallet.color || 'No Color';
//       if (!clusters[color]) {
//         clusters[color] = { color, totalPercentage: 0, wallets: [] };
//       }
//       clusters[color].totalPercentage += wallet.percentage;
//       clusters[color].wallets.push(wallet);
//     });
    
//     const clusterList = Object.values(clusters).map(cluster => ({
//       color: cluster.color,
//       totalPercentage: `${cluster.totalPercentage.toFixed(2)}%`,
//       wallets: cluster.wallets,
//     }));
    
//     console.log('[INFO] Clustered data:', clusterList);
//     return { walletList: walletsData, clusters: clusterList };
//   } catch (error) {
//     console.error('[ERROR] Failed to fetch wallet list data:', error.message);
//     return null;
//   } finally {
//     if (browser) await browser.close();
//   }
// }
