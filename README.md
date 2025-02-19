# Intro to Dragon Data-Modules

Dragon is a browser extension that visualizes the power concentrations of any token on the Solana blockchain. The extension is separated into "data-modules" that produce different analyses on a token's holders. This initial release includes four data-modules, and the module of focus for this bounty is:

**1. Token Info**
- Basic token information such as ticker, age, market cap, number of holders, and more.
- Basic security metrics such as mint authority revoked, freeze authority revoked, and locked liquidity pool.
  
Soon, developers will contribute their own modules to Dragon based on what they think is important for traders to know when in the trenches. 

---

## Table of Contents

- [Intro to Dragon Data-Modules](#intro-to-dragon-data-modules)
- [Table of Contents](#table-of-contents)
  - [Contribution Overview](#contribution-overview)
  - [Folder Structure](#folder-structure)
  - [Setup \& Installation](#setup--installation)
  - [Module Details](#module-details)
  - [Bounty Selection Criteria](#bounty-selection-criteria)
  - [Using Helius RPC for Integration](#using-helius-rpc-for-integration)
  - [Contributing](#contributing)
  - [Future Bounties](#future-bounties)
  - [Issues](#issues)
  - [License](#license)

---

## Contribution Overview

Each of Dragon's first four modules currently gathers data by web-scraping TrenchyBot, TrenchRadar, and Bubblemaps. The task is to build a pipeline that connects the Token Info module with a Solana RPC (ie. [Helius](https://www.helius.dev)) and replace all scrapes. If any data can not be retrieved from the RPC, the developer can use whatever means necessary given the goals stated in [Bounty Details](#bounty-details) below.

By fetching real-time data directly from a node, Dragon will become an unbeatable companion in the trenches.

---

## Folder Structure



```
dragon-data-modules/
├── package.json             # Project metadata and node dependencies
├── README.md                # This file
├── src
│   ├── api
│   │   └── server.js        # Express API server for data storage and retrieval which connects to the endpoints
│   ├── config
│   │   └── config.js        # Configuration file (ports, API keys, Helius RPC endpoint)
│   ├── modules
│   │   ├── bundleAnalysis.js   # Module for Bundle Analysis
│   │   ├── clusterAnalysis.js  # Module for Cluster Analysis
│   │   ├── tokenInfo.js        # Module for Token Info (Helius RPC integration) 
│   │   └── sniperAnalysis.js   # Module for Sniper Analysis (Helius RPC)
│   ├── telegram
│   │   └── telegramClient.js   # Telegram API integration & message processing which is used for tokenInfo.js and sniperAnalysis.js 
│   └── utils
│       ├── apiUtils.js         # Utility functions for API communication
│       └── telegramUtils.js    # Utility functions for parsing Telegram messages
│
└── frontend                  # Frontend code for the developer to test the backend
    ├── node_modules
    ├── public                # Contains static assets like images and stylesheets
    │   ├── css
    │   │   └── styles.css    
    │   ├── images
    │   └── js
    │       ├── chart2.js
    │       ├── charts.js    # Contains the frontend logic and connection requests to the backend 
    │       └── sidepanel.js
    ├── lib
    │   ├── fontawesome
    │   ├── chart.js
    │   └── vis-network.min.js
    ├── index.html           # The main entry point of the frontend, to all scripts and server
    ├── package-lock.json
    ├── package.json         # Manage dependencies and configurations for frontend
    └── server.js            # A backend entry point or middleware for API interaction

```

---

## Setup & Installation

1. **Clone the repository.**

   ```bash
   git clone https://github.com/alpha-dragon-dev/dragon-module1-tokeninfo.git
   cd dragon-module1-tokeninfo
   ```

2. **Install dependencies.**

   Install all required Node.js packages by running:

   ```bash
   npm install
   ```

3. **Configure the application.**

   Open `src/config/config.js` and update the following parameters as needed:

   - `API_SERVER_PORT` and `TELEGRAM_SERVER_PORT`: Set the ports for the API and Telegram servers.
   - `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`: Replace with your Telegram API credentials.
   - `HELIUS_RPC_URL`: Update with your Helius RPC endpoint and API key. This endpoint is used for blockchain data queries.

4. **Run the servers.**

   Start the API server in one terminal:

   ```bash
   npm start
   ```

   Then start the Telegram client (which also includes a small Express server) in another terminal:

   ```bash
   npm run telegram
   ```
5. **View results in testing environment.**

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


## Module Details

- **Module Name:** Token Info  
- **Bounty:** 0.10% of $DRAGON supply  
- **Goals:** Retrieve all data below in real-time and with extremely high accuracy.


### Data To Fetch

1. **Thumbnail**  
   The image that was chosen to represent the token across exchanges and trading platforms.  
   **Example Output:** <img src="https://assets.coingecko.com/coins/images/53854/standard/dogeai_pfp.jpg?1737610397" width="20">

3. **Ticker**  
   The alpha-numeric string that represents the token across exchanges and trading platforms.  
   **Example Output:** `$DOGEAI`

4. **Age**  
   How long it has been since the token generation event. *Note:* In this iteration, the frontend is displayed in units that range only from hours to years. We want to increase precision to include minutes as well. 0 hours will be the display for now if the token is less than 1 hour old.  
   **Example Output:** `23 hrs 4 mins` (23 h)  
   **Example Output:** `54 mins` (0 h)  
   **Example Output:** `9 months 21 days 4 hours 15 mins` (9 mo)
   
6. **Holders**  
   The number of distinct wallet addresses currently holding the token. *Note:* In this iteration, the frontend only goes to ">150" as the upper bound.  
   **Example Output:** `9,088` (>150)  
   **Example Output:** `141` (141)

7. **CTO or Dev**  
   Indicates if the token project has undergone a "community take over" as defined by purchasing the package on DEX Screener OR if it is still a developer-led project.  
   **Example Output:** `Dev`  
   **Metadata Example:** `https://solscan.io/account/J5DTWzM9ArZPjfymj4Y8CsRqM82ywLM34Q6nS6vjauez`  

9. **Market Cap**  
   The real-time total value (in USD) of the token supply in circulation.  
   **Example Output:** `$584,887`

10. **Mint Authority Revoked**  
   Specifies whether the authority to mint (create) additional tokens has been revoked.  
   **Example Output:** `True` (✅)

11. **Freeze Authority Revoked**  
   Specifies whether the authority to freeze or lock token transfers has been revoked.  
   **Example Output:** `True` (✅)
    
13. **Liquidity Locked**  
   Shows whether the liquidity pool has been locked, usually by burning the LP tokens.  
   **Example Output:** `True` (✅)

14. **DEX Screener Paid**  
    Indicates if fees have been paid to DEX Screener to host the project's social links and images/materials. Currently, this data is not available by web-scrape.  
    **Example Output:** `False` (❌)

15. **Photon Link**  
    A link to the token's chart on Photon. Currently, this data is not available by web-scrape.  
    **Metadata Example:** `https://photon-sol.tinyastro.io/en/lp/3d7PRDYq3CvRxFBoXrYeKr3DYYco2AnYupv9D9bAUoyH?handle=781371610492724a5aacb`

16. **Pump.fun Link**  
    A link to the token's page on Pump.fun (if applicable).  
    **Metadata Example:** `https://pump.fun/coin/9UYAYvVS2cZ3BndbsoG1ScJbjfwyEPGxjE79hh5ipump?coins_sort=market_cap`

17. **Solscan Link**  
    A link to the token’s contract on the Solscan block explorer.  
    **Metadata Example:** `https://solscan.io/token/9UYAYvVS2cZ3BndbsoG1ScJbjfwyEPGxjE79hh5ipump`

18. **DEX Screener Link**  
    A link to the token's chart on DEX Screener.  
    **Metadata Example:** `https://dexscreener.com/solana/3d7prdyq3cvrxfboxryekr3dyyco2anyupv9d9bauoyh`

19. **X Link**  
    A link to the official X account for the token project.  
    **Metadata Example:** `https://x.com/dogeai_gov`

20. **Telegram Link**  
    A link to the official Telegram community for the token project. Currently, this is not functioning correctly by web-scrape.  
    **Metadata Example:** `t.me/dogeAI`

21. **Website Link**  
    A link to the official website for the token project. Currently, this data is not available by web-scrape.  
    **Metadata Example:** `https://dogeai.info/`

### Module Output

We have included a testing environment where you can see your live code displayed in the module. The live module will be interactive, meaning you can hover to reveal the metadata you retrieved as well.

---

## Bounty Selection Criteria

We will select a recipient for this bounty based on the following criteria, in order of evaluation:
1. A fully complete retrieval of the data outlined in [Module Details](#module-details)
2. The highest accuracy for data retrieved in real-time
3. The fastest speed for data retrieval
4. If there is more than one developer to meet the above criteria, the first pull request will receive the bounty

---

## Using Helius RPC for Integration

[Helius](https://www.helius.dev) is a powerful RPC service that enables quick and direct access to on-chain data on Solana. By integrating Helius RPC calls into Dragon's data-modules, we can **replace slow web-scraping techniques** and **increase data accuracy.** 

**How to update the code**
- **Modify the stub functions:** In files like `src/modules/tokenInfo.js` and `src/api/server.js`, update the stub implementations to call the appropriate Helius RPC endpoints.
- **Leverage the configured endpoints:** Use the `HELIUS_RPC_URL` from `src/config/config.js` to ensure that your RPC calls are directed to the correct endpoint with your API key.
- **Improve performance:** Integrate batching of RPC calls if necessary to further improve response time.

*Note:* If any data can not be retrieved from RPC, or if data can be faster retrieved via another method such as data streams, the developer can implement the alternative method with a brief explanation for their choice.

---

## Contributing

1. **Fork the repository.**

2. **Create a feature branch.**

   ```bash
   git checkout -b feature/updated-module
   ```

3. **Replace** `server.js`, `tokenInfo.js`, `apiUtils.js`, **and** `telegramUtils.js` **with your stub functions.**


4. **Commit your changes.**

   ```bash
   git commit -am 'Add updated module for XYZ'
   ```

5. **Push the branch.**

   ```bash
   git push origin feature/updated-module
   ```

6. **Open a pull request describing your changes and the code you have contributed.**

---

## Future Bounties

Dragon’s aim is to make token analyses more transparent and community-driven. After the initial four modules, bounties will expand to include more data-modules on holder analyses and deception analyses on token supply.

If you have an idea for a data-module that could benefit traders in the trenches, please propose it [here](https://github.com/alpha-dragon-org/dragon-module-openIdeas) to be considered for a bounty.

---
## Issues

Please report any software “bugs” or other problems with this module through the issues tab here: [github.com/alpha-dragon-org/dragon-module1-tokeninfo](https://github.com/alpha-dragon-org/dragon-module1-tokeninfo)

---
## License

This project is open source and available under [the MIT License](https://opensource.org/license/mit).

---
<img src="https://github.com/alpha-dragon-org/dragon-module1-tokeninfo/blob/main/frontend/public/images/logo.gif?raw=true" width="200">
Want to meet the project co-founders?

