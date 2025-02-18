# Intro to Dragon Data-Modules

Dragon is a browser extension that visualizes the power concentrations of any token on the Solana blockchain. The extension is separated into "data-modules" that produce different analyses on a token's holders. This initial release includes four data-modules, and the module of focus for this bounty is:

**1. Token Info**
- Basic token information such as ticker, age, market cap, and number of holders.
- Basic security metrics such as mint authority revoked, freeze authority revoked, and locked liquidity pool.
  
Soon, developers will contribute their own modules to Dragon based on what they think is important for traders to know when in the trenches. 

---

## Table of Contents

- [Intro to Dragon Data-Modules](#intro-to-dragon-data-modules)
- [Table of Contents](#table-of-contents)
  - [Contribution Overview](#contribution-overview)
  - [Folder Structure](#folder-structure)
  - [Setup \& Installation](#setup--installation)
  - [Bounty Details](#bounty-details)
    - [Token Info Analysis](#token-info-analysis)
    - [Data to Fetch](#data-to-fetch)
  - [Using Helius RPC for Open Source Integration](#using-helius-rpc-for-open-source-integration)
  - [Future Bounties \& Modules](#future-bounties--modules)
  - [Contributing](#contributing)
  - [License](#license)

---

## Contribution Overview

Each of Dragon's first four modules currently gather data by web-scraping TrenchyBot, Trench Radar, and Bubblemaps. The challenge, and this bounty, is to build a pipeline that connects the Token Info module with a Solana RPC (ie. [Helius](https://www.helius.dev)), replacing these scrapes as much as possible. If any data can not be retrieved from the RPC, the developer can use whatever means necessary given the goals stated in [Bounty Details](#bounty-details) below.

By replacing web-scrapes with RPCs, Dragon will produce real-time data for traders and become an unbeatable companion in the trenches.

---

## Folder Structure



```
dragon-data-modules/
├── package.json             # Project metadata and dependencies
├── README.md                # This file
├── src
│   ├── api
│   │   └── server.js        # Express API server for data storage and retrieval # CONNECT TO ENDPOINT IN THIS FILE
│   ├── config
│   │   └── config.js        # Configuration file (ports, API keys, Helius RPC endpoint)
│   ├── modules
│   │   ├── bundleAnalysis.js   # Module for Bundle Analysis
│   │   ├── clusterAnalysis.js  # Module for Cluster Analysis
│   │   ├── tokenInfo.js        # Module for Token Info (Helius RPC integration) # MAKE CHANGES IN THIS FILE
│   │   └── sniperAnalysis.js   # Module for Sniper Analysis (Helius RPC)
│   ├── telegram
│   │   └── telegramClient.js   # Telegram API integration & message processing
│   └── utils
│       ├── apiUtils.js         # Utility functions for API communication
│       └── telegramUtils.js    # Utility functions for parsing Telegram messages
│
└── frontend                  # Frontend code for the developer to test the backend
    ├── node_modules
    ├── public
    │   ├── css
    │   │   └── styles.css
    │   ├── images
    │   └── js
    │       ├── chart2.js
    │       ├── charts.js
    │       └── sidepanel.js
    ├── lib
    │   ├── fontawesome
    │   ├── chart.js
    │   └── vis-network.min.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    └── server.js

```

---

## Setup & Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/alpha-dragon-dev/dragon-module1-tokeninfo.git
   cd dragon-module1-tokeninfo
   ```

2. **Install Dependencies:**

   Install all required Node.js packages by running:

   ```bash
   npm install
   ```

3. **Configure the Application:**

   Open `src/config/config.js` and update the following parameters as needed:

   - `API_SERVER_PORT` and `TELEGRAM_SERVER_PORT`: Set the ports for the API and Telegram servers.
   - `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`: Replace with your Telegram API credentials.
   - `HELIUS_RPC_URL`: Update with your Helius RPC endpoint and API key. This endpoint is used for blockchain data queries.

4. **Run the Servers:**

   Start the API server in one terminal:

   ```bash
   npm start
   ```

   And then start the Telegram client (which also includes a small Express server) in another terminal:

   ```bash
   npm run telegram
   ```
5. **To View Results on Frontend:**
   Start the API server to fetch data from backend:

   ```bash
   cd frontend
   npm install
   npm start
   ```   

   View results on:

   ```bash
   http://localhost:8080/
   ```

---


## Bounty Details

- **Module Name:** Token Info  
- **Bounty:** 0.15% of $DRAGON supply  
- **Goal:** Create a pipeline to an RPC that retrieves all data below in real-time and with extremely high accuracy.

---

### Data To Fetch

1. **Thumbnail**  
   The image that was chosen to represent the token across exchanges in the trading platforms.  
   **Example Output:** <img src="https://assets.coingecko.com/coins/images/53854/standard/dogeai_pfp.jpg?1737610397" width="20">

3. **Ticker**  
   The alpha-nummeric string that was chosen to represent the token across exchanges.  
   **Example Output:** `$Prawn`

4. **Age**  
   How long the token has been in existence. Note: At the moment, the front end is displayed in units that range from hours to years. In the back-end we want to increase precision to include minutes as well. In this iteration, the front-end will show 0 hours if the token is less than 1 hour old.
   **Example Output:** `23 hrs 4 mins` (front-end: 23 h)
   **Example Output:** `23 mins` (front-end: 0 h)
   **Example Output:** `9 months 21 days 4 hours 15 mins` (front-end: 9 m)
   
5. **Holders**  
   The number of distinct wallet addresses currently holding the token. At the moment, the front-end will only show ">150" but that will be updated after this bounty.
   **Example Output:** `9,088` (front-end: >150)
   **Example Output:** `141` (front-end: 141)

6. **CTO or Dev**  
   Indicates if the token is a "community take over" as defined by CTO pur on DEX Screener or is still developer-led.  
   **Example Output:** `Dev`

7. **Market Cap**  
   The total value (in USD) of the token supply in circulation.  
   **Example Output:** `$584,887`

8. **Mint Authority**  
   Specifies whether the authority to mint (create) additional tokens has been revoked.  
   **Example Output:** `Mint`

9. **Freeze Authority**  
   Specifies whether the authority to freeze or lock token transfers has been revoked.  
   **Example Output:** `Freeze`

10. **Liquidity Locked**  
   Shows whether the liquidity pool has been locked, usually by burning the LP tokens.  
   **Example Output:** `Locked`

11. **DEX Screener Paid**  
    Indicates if fees have been paid to DEX Screener to officially host the project's social links and materials. Currently, this is not available by web-scrape.
    **Example Output:** `Dex`

12. **Photon Link**  
    A link to the token's chart on Photon. Currently, this is not available by web-scrape.
    **Example Output:** `Link`

13. **Pump.fun Link**  
    A link to the token's page on Pump.fun (if applicable).  
    **Example Output:** `Link`

14. **Solscan Link**  
    A link to the token’s contract on the Solscan block explorer.  
    **Example Output:** `Link`

15. **DEX Screener Link**  
    A link to the token's chart on DEX Screener.  
    **Example Output:** `Link`

16. **Twitter Link**  
    A link to the official Twitter account for the token project.  
    **Example Output:** `Link`

17. **Telegram Link**  
    A link to the official Telegram community for the token project. Currently, this is not functioning correctly by web-scrape.
    **Example Output:** `Link`

18. **Website Link**  
    A link to the official website for the token project.  
    **Example Output:** `Link`

---

## Using Helius RPC for Open Source Integration

Helius is a powerful RPC service that enables quick and direct access to on-chain data on Solana. By integrating Helius RPC calls into our modules, we can:

- **Replace Slow Web-Scraping:** Instead of relying solely on web-scraping methods, modules such as Token Info Analysis and Sniper Analysis can fetch real-time data directly from the blockchain.
- **Enhance Data Accuracy:** Helius provides accurate and up-to-date blockchain metrics (e.g., token supply, market cap, holder counts).
- **Quick Response Times:** The use of Helius RPC ensures fast responses, which is essential for real-time updates in the front-end extension.

**How to Update the Current Code:**
- **Modify the Stub Functions:** In files like `src/modules/tokenInfo.js` and `src/modules/sniperAnalysis.js`, update the stub implementations to call the appropriate Helius RPC endpoints.
- **Leverage Configured Endpoints:** Use the `HELIUS_RPC_URL` from `src/config/config.js` to ensure that your RPC calls are directed to the correct endpoint with your API key.
- **Improve Performance:** Integrate caching or batching of RPC calls if necessary to further improve response times for the front-end.

---

## Future Bounties & Modules

Dragon is an evolving project. In addition to the current four modules, future bounties will include:

- **Deception Metrics Module:** Analyze deceptive practices in token projects and flag potential red flags.
- **Holder Distribution Analysis:** Provide a detailed breakdown of token holders, including concentration analysis.
- **Liquidity Analysis:** Monitor and report on liquidity pool dynamics and trading activities.
- **Community Sentiment Analysis:** Integrate social media and on-chain data to gauge community sentiment.
- **New Metrics Modules:** Based on community feedback and emerging trends, new modules can be crowd-sourced and developed.

These future modules will be developed by community contributions and bounty rewards. If you have a new idea or module that could benefit the Dragon ecosystem, feel free to propose it and start working on a bounty.

---

## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the Repository**

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/new-module
   ```

3. **Replace server.js, tokeninfo.js, apiutils.js, and telegramutils.js with your code snippets**


4. **Commit Your Changes:**

   ```bash
   git commit -am 'Add new module for XYZ'
   ```

5. **Push the Branch:**

   ```bash
   git push origin feature/new-module
   ```

6. **Open a Pull Request** describing your changes and the module you are adding.


---

## License

This project is open source and available under the MIT License.

Happy coding and bounty hunting!
Build Mods, Collect Bounties.
Contribute to Dragon and help reveal the hidden techniques in token projects on Solana.
