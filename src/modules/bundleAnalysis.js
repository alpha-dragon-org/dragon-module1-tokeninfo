// // src/modules/bundleAnalysis.js
// import puppeteer from 'puppeteer';

// export async function fetchBundleData(parsedJSON) {
//   let browser = null;
//   try {
//     const pumpAddress = parsedJSON.pumpFunLink 
//       ? parsedJSON.pumpFunLink.split('/').pop()
//       : null;
//     if (!pumpAddress) {
//       console.log('[WARNING] No pump address found in message for Bundle data');
//       return null;
//     }
//     const bundleUrl = `https://trench.bot/bundles/${pumpAddress}`;
//     console.log('[INFO] Navigating to Bundle URL:', bundleUrl);
    
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     const page = await browser.newPage();
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
//       '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
//     );
//     await page.goto(bundleUrl, { waitUntil: 'networkidle2', timeout: 90000 });
    
//     console.log('[INFO] Waiting for left panel data...');
//     await page.waitForSelector('.overall-info-overlay .info-item', { timeout: 90000 });
    
//     const leftPanelData = await page.evaluate(() => {
//       const infoItems = document.querySelectorAll('.overall-info-overlay .info-item');
//       const data = {};
//       infoItems.forEach((item) => {
//         const label = item.querySelector('.info-label')?.textContent.replace(':', '').trim();
//         const valueElement = item.querySelector('.info-value');
//         if (label && valueElement) {
//           data[label] = valueElement.textContent.trim();
//         }
//       });
//       return data;
//     });
    
//     // If no bundles are present, return the left panel data only.
//     const noBundles = await page.evaluate(() => !!document.querySelector('.no-bundles-message'));
//     if (noBundles) {
//       console.log('[INFO] No bundles detected.');
//       return { bundleData: [], leftPanelData };
//     }
    
//     console.log('[INFO] Waiting for bundle bubbles...');
//     await page.waitForSelector('.bubble', { timeout: 90000 });
//     // Optional delay for rendering
//     await new Promise(resolve => setTimeout(resolve, 5000));
    
//     const bundleData = await page.evaluate(() => {
//       const results = [];
//       const bubbles = document.querySelectorAll('.bubble');
//       bubbles.forEach(bubble => {
//         const title = bubble.getAttribute('title');
//         const percentageElem = bubble.querySelector('.token-percentage');
//         const percentage = percentageElem ? percentageElem.textContent.trim() : null;
//         const data = { title: title || 'No Title', percentage: percentage || '0%' };
//         if (title) {
//           const match = title.match(/Bundle ID: (\d+).*?Token %: ([\d.]+)%.*?Holding %: ([\d.]+)%/);
//           if (match) {
//             data.bundleId = match[1];
//             data.tokenPercentage = parseFloat(match[2]);
//             data.holdingPercentage = parseFloat(match[3]);
//           }
//         }
//         results.push(data);
//       });
//       return results;
//     });
    
//     console.log('[INFO] Fetched bundle data:', bundleData);
//     return { bundleData, leftPanelData };
//   } catch (error) {
//     console.error('[ERROR] Failed to fetch bundle data:', error.message);
//     return null;
//   } finally {
//     if (browser) await browser.close();
//   }
// }
