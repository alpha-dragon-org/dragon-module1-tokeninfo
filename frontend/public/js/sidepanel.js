import { initializeTelegramClient, scrapeMessagesAndFetchLinks } from './lib/telegramClient.js';

(async () => {
    try {
        // Initialize Telegram Client
        const client = await initializeTelegramClient();

        // Start scraping messages and fetching links
        await scrapeMessagesAndFetchLinks(client);

        // Update every 5 seconds
        setInterval(async () => {
            console.log('[INFO] Updating data every 5 seconds...');
            try {
                await scrapeMessagesAndFetchLinks(client);
            } catch (error) {
                console.error('[ERROR] Failed to update data:', error);
            }
        }, 5000);
    } catch (error) {
        console.error('[ERROR] Something went wrong:', error);
    }
})();

// Check if the tab is in the current window
async function isTabInWindow(targetWindowId) {
    try {
        const currentWindow = await chrome.windows.getCurrent();
        return currentWindow.id === targetWindowId;
    } catch (error) {
        console.error('[ERROR] Error checking window ID:', error);
        return false;
    }
}

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener(async (msg) => {
    const { name, url, data } = msg;

    if (name === 'graphql-result') {
        try {
            handleGraphQLResult(data, url);
        } catch (error) {
            console.error('[ERROR] Failed to process GraphQL result:', error);
        }
    }

    if (name === 'tab-change') {
        try {
            const isCurrentWindow = await isTabInWindow(msg.windowId);
            if (!isCurrentWindow) return;

            handleTabChange(url);
        } catch (error) {
            console.error('[ERROR] Failed to handle tab change:', error);
        }
    }
});

// Handle GraphQL results and update the graph
const handleGraphQLResult = (data, url) => {
    const nodes = {};
    const edges = [];
    extractDict(nodes, edges, data.value);

    if (edges.length > 0) {
        document.getElementById('loader').style.display = 'flex';
        updateGraphData(nodes, edges);

        if (!optionsMap[url]) {
            optionsMap[url] = {};
        }
        optionsMap[url].activeGraph = activeGraph;
        document.getElementById('newTab').activeData = data.value;
    }
};

// Update the graph with nodes and edges
const updateGraphData = (nodes, edges) => {
    const result = convertToVisualizationFormat(nodes, edges);
    activeGraph = {
        nodes: new vis.DataSet(result.nodes),
        edges: new vis.DataSet(result.edges),
    };

    adjustPhysicsOptions(activeGraph.nodes.length);
    network.setData(activeGraph);
    network.activeGraph = activeGraph;
};

// Adjust physics options based on node count
const adjustPhysicsOptions = (nodeCount) => {
    const options = network.physics.options.barnesHut;

    if (nodeCount > 300) {
        options.gravitationalConstant = -20000;
        options.springConstant = 0.02;
        options.springLength = 80;
    } else {
        options.gravitationalConstant = -800;
        options.springConstant = 0.04;
        options.springLength = 95;
    }
};





















// import { initializeTelegramClient, scrapeMessagesAndFetchLinks } from './lib/telegramClient.js';

// (async () => {
//     try {
//         // Initialize Telegram Client
//         const client = await initializeTelegramClient();

//         // Start scraping messages and fetching links
//         await scrapeMessagesAndFetchLinks(client);

//         // Update every 5 seconds
//         setInterval(async () => {
//             console.log('[INFO] Updating data every 5 seconds...');
//             try {
//                 await scrapeMessagesAndFetchLinks(client);
//             } catch (error) {
//                 console.error('[ERROR] Failed to update data:', error);
//             }
//         }, 5000);
//     } catch (error) {
//         console.error('[ERROR] Something went wrong:', error);
//     }
// })();

// // Check if the tab is in the current window
// async function isTabInWindow(targetWindowId) {
//     try {
//         const currentWindow = await chrome.windows.getCurrent();
//         return currentWindow.id === targetWindowId;
//     } catch (error) {
//         console.error('[ERROR] Error checking window ID:', error);
//         return false;
//     }
// }

// // Handle messages from other parts of the extension
// chrome.runtime.onMessage.addListener(async (msg) => {
//     const { name, url, data } = msg;

//     if (name === 'graphql-result') {
//         try {
//             handleGraphQLResult(data, url);
//         } catch (error) {
//             console.error('[ERROR] Failed to process GraphQL result:', error);
//         }
//     }

//     if (name === 'tab-change') {
//         try {
//             const isCurrentWindow = await isTabInWindow(msg.windowId);
//             if (!isCurrentWindow) return;

//             handleTabChange(url);
//         } catch (error) {
//             console.error('[ERROR] Failed to handle tab change:', error);
//         }
//     }
// });

// // Handle GraphQL results and update the graph
// const handleGraphQLResult = (data, url) => {
//     const nodes = {};
//     const edges = [];
//     extractDict(nodes, edges, data.value);

//     if (edges.length > 0) {
//         document.getElementById('loader').style.display = 'flex';
//         updateGraphData(nodes, edges);

//         if (!optionsMap[url]) {
//             optionsMap[url] = {};
//         }
//         optionsMap[url].activeGraph = activeGraph;
//         document.getElementById('newTab').activeData = data.value;
//     }
// };

// // Update the graph with nodes and edges
// const updateGraphData = (nodes, edges) => {
//     const result = convertToVisualizationFormat(nodes, edges);
//     activeGraph = {
//         nodes: new vis.DataSet(result.nodes),
//         edges: new vis.DataSet(result.edges),
//     };

//     adjustPhysicsOptions(activeGraph.nodes.length);
//     network.setData(activeGraph);
//     network.activeGraph = activeGraph;
// };

// // Adjust physics options based on node count
// const adjustPhysicsOptions = (nodeCount) => {
//     const options = network.physics.options.barnesHut;

//     if (nodeCount > 300) {
//         options.gravitationalConstant = -20000;
//         options.springConstant = 0.02;
//         options.springLength = 80;
//     } else {
//         options.gravitationalConstant = -800;
//         options.springConstant = 0.04;
//         options.springLength = 95;
//     }
// };

// // Handle tab changes and update the graph accordingly
// const handleTabChange = (url) => {
//     const hostname = new URL(url).hostname;
//     const value = optionsMap[hostname] || optionsMap[getDefaultMode()];

//     if (value) {
//         network.setOptions(value.options);
//         network.setData(value.activeGraph || { nodes: [], edges: [] });
//         document.getElementById('newTab').activeData = null;

//         if (value.activeGraph) {
//             document.getElementById('loader').style.display = 'flex';
//             network.setData(value.activeGraph);
//         }
//     }
// };

// // Get the default mode (dark or light)
// const getDefaultMode = () => {
//     return window.matchMedia('(prefers-color-scheme: dark)').matches
//         ? 'dark-mode'
//         : 'light-mode';
// };

// // Handle "New Tab" button click
// document.addEventListener('DOMContentLoaded', () => {
//     const newTabButton = document.getElementById('newTab');
//     if (!newTabButton) return;

//     newTabButton.addEventListener('click', async () => {
//         const activeData = newTabButton.activeData;
//         if (!activeData) return;

//         try {
//             const encodedData = await compressAndEncodeBase64(activeData);
//             const url = `https://Dragon.matthewmcneely.net/?data=${base64ToUrlSafe(encodedData)}`;
//             chrome.windows.create({ url });
//         } catch (error) {
//             console.error('[ERROR] Failed to open new tab:', error);
//         }
//     });
// });


















// import { initializeTelegramClient, scrapeMessagesAndFetchLinks } from './lib/telegramClient.js';
// (async () => {
//     try {
//         // Initialize Telegram Client
//         const client = await initializeTelegramClient();

//         // Start scraping messages and fetching links
//         await scrapeMessagesAndFetchLinks(client);

//         // Update every 5 seconds
//         setInterval(() => {
//             console.log('[INFO] Updating data every 5 seconds...');
//             scrapeMessagesAndFetchLinks(client);
//         }, 5000);
//     } catch (error) {
//         console.error('[ERROR] Something went wrong:', error);
//     }
// })();







// async function isTabInWindow(targetWindowId) {
//     try {
//         // Get the current tab's window ID
//         const currentWindow = await chrome.windows.getCurrent();
//         const currentWindowId = currentWindow.id;
//         //console.log("current window", currentWindowId, "target window", targetWindowId)
//         // Check if the current window ID matches the target window ID
//         return currentWindowId === targetWindowId;
//     } catch (error) {
//         //console.error("Error checking window ID:", error);
//         return false; // Assume not in the target window if an error occurs
//     }
// }

// chrome.runtime.onMessage.addListener((msg) => {
//     let name = msg.name;
//     let url = msg.url;
//     //console.log("content script received message", msg);
//     if (name == "graphql-result") {
//         nodes = {}
//         edges = []
//         extractDict(nodes, edges, msg.data.value);
//         if (edges.length > 0) {
//             document.getElementById('loader').style.display = 'flex';
//             result = convertToVisualizationFormat(nodes, edges);
//             activeGraph = {
//                 nodes: new vis.DataSet(result.nodes),
//                 edges: new vis.DataSet(result.edges)
//             }
//             if (activeGraph.nodes.length > 300) {
//                 network.physics.options.barnesHut.gravitationalConstant = -20000
//                 network.physics.options.barnesHut.springConstant = 0.02
//                 network.physics.options.barnesHut.springLength = 80
//             } else {
//                 network.physics.options.barnesHut.gravitationalConstant = -800
//                 network.physics.options.barnesHut.springConstant = 0.04
//                 network.physics.options.barnesHut.springLength = 95
//             }
//             network.setData(activeGraph)
//             network["activeGraph"] = activeGraph
//             let url = ""
//             if (msg.url) {
//                 url = msg.url
//             }
//             if (!optionsMap[url]) {
//                 optionsMap[url] = {}
//             }
//             optionsMap[url]["activeGraph"] = activeGraph
//             document.getElementById('newTab')["activeData"] = msg.data.value
//         }
//     }
//     if (name == "tab-change") {
//         if (!isTabInWindow(msg.windowId)) {
//             return;
//         }
//         let hostname = ""
//         try {
//             hostname = new URL(url).hostname
//         } catch (e) {
//             return
//         }
//         let value = optionsMap[hostname]
//         if (!value) {
//             if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//                 hostname = "dark-mode"
//             } else {
//                 hostname = "light-mode"
//             }
//             value = optionsMap[hostname]
//         }
//         network.setOptions(optionsMap[hostname].options);
//         document.getElementById('vis').style.backgroundColor = value["body-background-color"];
//         network.setData({ nodes: [], edges: [] })
//         network.redraw()
//         document.getElementById('newTab')["activeData"] = null
//         if (optionsMap[url] && optionsMap[url]["activeGraph"]) {
//             document.getElementById('loader').style.display = 'flex';
//             network.setData(optionsMap[url]["activeGraph"]);
//         }
//     }
// });

// document.addEventListener('DOMContentLoaded', function() {
//     if (!document.getElementById('newTab')) {
//         return
//     }
//     document.getElementById('newTab').addEventListener('click', function() {
//         let activeData = document.getElementById('newTab')["activeData"]
//         if (!activeData) {
//             return
//         }
//         // encode the data to base64
//         //let encodedData = btoa(JSON.stringify(activeData));
//         compressAndEncodeBase64(activeData).then((encodedData) => {
//             let url = "https://Dragon.matthewmcneely.net/"
//             let data = base64ToUrlSafe(encodedData)
//             chrome.windows.create({ url: url + `?data=${data}` });
//         });
//     });

// });