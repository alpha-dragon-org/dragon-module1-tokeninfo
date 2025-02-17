document.addEventListener("DOMContentLoaded", function () {
  // Reset both output and data-field elements to placeholders
  function resetFields() {
    // --- Output Section ---
    document.getElementById("tickerValue").textContent = "Loading....";
    document.getElementById("tokenAge").textContent = "Loading....";
    document.getElementById("holdersCount").textContent = "Loading....";
    document.getElementById("marketCap").textContent = "Loading....";

    // --- Data Field Section ---
    document.getElementById("dataTickerValue").textContent = "Loading....";
    document.getElementById("dataTokenAge").textContent = "Loading....";
    document.getElementById("dataHoldersCount").textContent = "Loading....";
    document.getElementById("dataMarketCap").textContent = "Loading....";
    document.getElementById("dataCTODev").textContent = "Loading...";

    // Reset statuses for Mint, Freeze, Locked, and DEX in both sections
    const resetStatus = (id, iconClass, statusText) => {
      // Update output status
      const outputEl = document.getElementById(id);
      if (outputEl) {
        const icon = outputEl.querySelector("i");
        const span = outputEl.querySelector("span");
        if (icon) icon.className = iconClass;
        if (span) span.textContent = statusText;
      }
      // Update data-field status (id prefixed with "data" and capitalized first letter)
      const dataId = "data" + id.charAt(0).toUpperCase() + id.slice(1);
      const dataEl = document.getElementById(dataId);
      if (dataEl) {
        dataEl.innerHTML = `<i class="${iconClass}"></i> ${statusText}`;
      }
    };

    resetStatus("mintStatus", "fas fa-check-circle success", "Mint");
    resetStatus("freezeStatus", "fas fa-check-circle success", "Freeze");
    resetStatus("lockedStatus", "fas fa-check-circle success", "Locked");
    resetStatus("dexStatus", "fas fa-check-circle success", "DEX");

    // Reset platform links in both output and data-field sections
    const outputPlatformLinks = document.querySelectorAll(
      ".platform-links a.platform-link"
    );
    outputPlatformLinks.forEach((link) => {
      link.href = "#";
      link.classList.add("inactive");
    });

    const dataPlatformIds = [
      "dataPumpLink",
      "dataSolscanLink",
      "dataDexscreenerLink",
      "dataTwitterLink",
      "dataTelegramLink",
      "dataWebsiteLink",
    ];
    dataPlatformIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.href = "#";
        el.classList.add("inactive");
        el.textContent = "Link";
      }
    });

    console.log("[INFO] Fields reset to placeholders.");
  }

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(
        // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/fetchData"
        'http://localhost:3000/fetchData'

      );
      const data = await response.json();
      console.log("Fetched the data!");
      console.log(data);

      if (Array.isArray(data) && data.length > 0) {
        const latestData = data[data.length - 1];

        updateTicker(latestData);
        updateSidepanel(latestData);
        updateHoldersCount();
        updatePlatformLinks(latestData);
        updateFreezeStatus(latestData);
        updateMintStatus(latestData);
        updateDexStatus(latestData);
        updateLockedStatus(latestData);
      }
    } catch (error) {
      console.error("[ERROR] Error in fetchData:", error);
    }
  };

  // Function to send contract address to the Telegram bot
  const sendContractAddressToBot = async (contractAddress) => {
    try {
      const apiEndpoint =
        // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3001/sendContractAddress";
        'http://localhost:3001/sendContractAddress';

        
      console.log(
        "[DEBUG] Payload being sent:",
        JSON.stringify({ contractAddress })
      );
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress }),
      });
      if (response.ok) {
        console.log(
          "[INFO] Contract address sent successfully:",
          contractAddress
        );
      } else {
        console.error(
          "[ERROR] Failed to send contract address. Response:",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "[ERROR] Error while sending contract address:",
        error.message
      );
    }
  };

  // Function to clear API data
  const clearAPIData = async () => {
    try {
      const response = await fetch(
        // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/clearData",
        "http://localhost:3000/clearData",
                { method: "POST" }
      );
      if (response.ok) {
        console.log("[INFO] API data cleared successfully.");
      } else {
        console.error(
          "[ERROR] Failed to clear API data:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("[ERROR] Error clearing API data:", error);
    }
  };

  // Update Holders Count (both sections)
  const updateHoldersCount = () => {
    const outputHolders = document.getElementById("holdersCount");
    const dataHolders = document.getElementById("dataHoldersCount");
    if (outputHolders) {
      outputHolders.textContent = ">150";
    }
    if (dataHolders) {
      dataHolders.textContent = ">150";
    }
  };

  // Update Ticker value (both sections)
  const updateTicker = (latestData) => {
    const tickerValue = latestData?.bundleData?.leftPanelData?.Ticker;
    // Output section
    const outputTicker = document.getElementById("tickerValue");
    if (outputTicker && tickerValue) {
      outputTicker.textContent = `$${tickerValue}`;
      console.log("[INFO] Ticker updated:", tickerValue);
    } else {
      console.warn(
        "[WARN] Ticker data missing or element not found in output."
      );
    }
    // Data-field section
    const dataTicker = document.getElementById("dataTickerValue");
    if (dataTicker && tickerValue) {
      dataTicker.textContent = `$${tickerValue}`;
    } else {
      console.warn(
        "[WARN] Ticker data missing or element not found in data-field."
      );
    }
  };

  // Update Market Cap and Token Age in sidepanel (both sections)
  const updateSidepanel = (latestData) => {
    // --- Market Cap ---
    let marketCapValue = null;
    if (latestData["💰 MC"]) {
      marketCapValue = latestData["💰 MC"];
    } else if (
      latestData["🦅 Dexscreener"] &&
      Array.isArray(latestData["🦅 Dexscreener"])
    ) {
      const marketCapLine = latestData["🦅 Dexscreener"].find((line) =>
        line.includes("💰 MC:")
      );
      if (marketCapLine) {
        marketCapValue = marketCapLine.split(": ")[1];
      }
    }
    const outputMC = document.getElementById("marketCap");
    const dataMC = document.getElementById("dataMarketCap");
    if (outputMC) {
      outputMC.textContent = marketCapValue || "N/A";
      console.log("[INFO] Market Cap updated:", marketCapValue);
    }
    if (dataMC) {
      dataMC.textContent = marketCapValue || "N/A";
    }

    // --- Token Age ---
    const ageValue = latestData["🕒 Age"] || latestData["⏳ Age"];
    let formattedAge = "";
    if (ageValue) {
      const yearsMatch = ageValue.match(/(\d+)\s?yrs?/);
      const monthsMatch = ageValue.match(/(\d+)\s?months?/);
      const daysMatch = ageValue.match(/(\d+)\s?days?/);
      const hoursMatch = ageValue.match(/(\d+)\s?hrs?/);
      if (yearsMatch) {
        formattedAge = `${yearsMatch[1]} y`;
      } else if (monthsMatch) {
        formattedAge = `${monthsMatch[1]} m`;
      } else if (daysMatch) {
        formattedAge = `${daysMatch[1]} d`;
      } else if (hoursMatch) {
        formattedAge = `${hoursMatch[1]} h`;
      }
    } else {
      formattedAge = "N/A";
      console.warn("[WARN] Age data missing.");
    }
    const outputAge = document.getElementById("tokenAge");
    const dataAge = document.getElementById("dataTokenAge");
    if (outputAge) {
      outputAge.textContent = formattedAge;
      console.log("[INFO] Token Age updated:", formattedAge);
    }
    if (dataAge) {
      dataAge.textContent = formattedAge;
    }
  };

  // Update Platform Links (both sections)
  const updatePlatformLinks = (latestData) => {
    const pumpFunLink = latestData.pumpFunLink;
    const solscanLink = latestData.solscanLinks?.[0];
    const dexscreenerLink = latestData.dexscreenerLink;
    const twitterLink = latestData.twitterLinks?.[0];
    const telegramLink = latestData.telegramLinks?.[0];
    let websiteLink = "";
    if (latestData.websiteLinks && latestData.websiteLinks.length > 0) {
      // If more than one website link exists, pick the second one
      websiteLink =
        latestData.websiteLinks.length > 1
          ? latestData.websiteLinks[1]
          : latestData.websiteLinks[0];
    }

    // --- Output Section Links (using title attributes) ---
    // Pump.fun
    const pumpLinkOutput = document.querySelector("a[title='Pump']");
    if (pumpLinkOutput && pumpFunLink) {
      pumpLinkOutput.href = pumpFunLink;
      pumpLinkOutput.classList.remove("inactive");
      console.log("[INFO] Pump Fun link updated:", pumpFunLink);
    } else if (pumpLinkOutput) {
      pumpLinkOutput.classList.add("inactive");
      pumpLinkOutput.removeAttribute("href");
      console.log("[INFO] Pump Fun link inactive");
    }
    // Solscan
    const solscanLinkOutput = document.querySelector("a[title='Solscan']");
    if (solscanLinkOutput && solscanLink) {
      solscanLinkOutput.href = solscanLink;
      solscanLinkOutput.classList.remove("inactive");
      console.log("[INFO] Solscan link updated:", solscanLink);
    } else if (solscanLinkOutput) {
      solscanLinkOutput.classList.add("inactive");
      solscanLinkOutput.removeAttribute("href");
      console.log("[INFO] Solscan link inactive");
    }
    // DexScreener
    const dexscreenerLinkOutput = document.querySelector("a[title='DexScreener']");
    if (dexscreenerLinkOutput && dexscreenerLink) {
      dexscreenerLinkOutput.href = dexscreenerLink;
      dexscreenerLinkOutput.classList.remove("inactive");
      console.log("[INFO] DexScreener link updated:", dexscreenerLink);
    } else if (dexscreenerLinkOutput) {
      dexscreenerLinkOutput.classList.add("inactive");
      dexscreenerLinkOutput.removeAttribute("href");
      console.log("[INFO] DexScreener link inactive");
    }
    // Twitter
    const twitterLinkOutput = document.querySelector("a[title='Twitter']");
    if (twitterLinkOutput && twitterLink) {
      twitterLinkOutput.href = twitterLink;
      twitterLinkOutput.classList.remove("inactive");
      console.log("[INFO] Twitter link updated:", twitterLink);
    } else if (twitterLinkOutput) {
      twitterLinkOutput.classList.add("inactive");
      twitterLinkOutput.removeAttribute("href");
      console.log("[INFO] Twitter link inactive");
    }
    // Telegram
    const telegramLinkOutput = document.querySelector("a[title='Telegram']");
    if (telegramLinkOutput && telegramLink) {
      telegramLinkOutput.href = telegramLink;
      telegramLinkOutput.classList.remove("inactive");
      console.log("[INFO] Telegram link updated:", telegramLink);
    } else if (telegramLinkOutput) {
      telegramLinkOutput.classList.add("inactive");
      telegramLinkOutput.removeAttribute("href");
      console.log("[INFO] Telegram link inactive");
    }
    // Website
    const websiteLinkOutput = document.querySelector("a[title='Website']");
    if (websiteLinkOutput && websiteLink) {
      websiteLinkOutput.href = websiteLink;
      websiteLinkOutput.classList.remove("inactive");
      console.log("[INFO] Website link updated:", websiteLink);
    } else if (websiteLinkOutput) {
      websiteLinkOutput.classList.add("inactive");
      websiteLinkOutput.removeAttribute("href");
      console.log("[INFO] Website link inactive");
    }

    // --- Data-field Section Links ---
    // Pump.fun
    const dataPumpLink = document.getElementById("dataPumpLink");
    if (dataPumpLink && pumpFunLink) {
      dataPumpLink.href = pumpFunLink;
      dataPumpLink.classList.remove("inactive");
      dataPumpLink.textContent = "Link";
      console.log("[INFO] Data Pump Fun link updated:", pumpFunLink);
    } else if (dataPumpLink) {
      dataPumpLink.classList.add("inactive");
      dataPumpLink.removeAttribute("href");
    }
    // Solscan
    const dataSolscanLink = document.getElementById("dataSolscanLink");
    if (dataSolscanLink && solscanLink) {
      dataSolscanLink.href = solscanLink;
      dataSolscanLink.classList.remove("inactive");
      dataSolscanLink.textContent = "Link";
      console.log("[INFO] Data Solscan link updated:", solscanLink);
    } else if (dataSolscanLink) {
      dataSolscanLink.classList.add("inactive");
      dataSolscanLink.removeAttribute("href");
    }
    // Dexscreener
    const dataDexscreenerLink = document.getElementById("dataDexscreenerLink");
    if (dataDexscreenerLink && dexscreenerLink) {
      dataDexscreenerLink.href = dexscreenerLink;
      dataDexscreenerLink.classList.remove("inactive");
      dataDexscreenerLink.textContent = "Link";
      console.log("[INFO] Data Dexscreener link updated:", dexscreenerLink);
    } else if (dataDexscreenerLink) {
      dataDexscreenerLink.classList.add("inactive");
      dataDexscreenerLink.removeAttribute("href");
    }
    // Twitter
    const dataTwitterLink = document.getElementById("dataTwitterLink");
    if (dataTwitterLink && twitterLink) {
      dataTwitterLink.href = twitterLink;
      dataTwitterLink.classList.remove("inactive");
      dataTwitterLink.textContent = "Link";
      console.log("[INFO] Data Twitter link updated:", twitterLink);
    } else if (dataTwitterLink) {
      dataTwitterLink.classList.add("inactive");
      dataTwitterLink.removeAttribute("href");
    }
    // Telegram
    const dataTelegramLink = document.getElementById("dataTelegramLink");
    if (dataTelegramLink && telegramLink) {
      dataTelegramLink.href = telegramLink;
      dataTelegramLink.classList.remove("inactive");
      dataTelegramLink.textContent = "Link";
      console.log("[INFO] Data Telegram link updated:", telegramLink);
    } else if (dataTelegramLink) {
      dataTelegramLink.classList.add("inactive");
      dataTelegramLink.removeAttribute("href");
    }
    // Website
    const dataWebsiteLink = document.getElementById("dataWebsiteLink");
    if (dataWebsiteLink && websiteLink) {
      dataWebsiteLink.href = websiteLink;
      dataWebsiteLink.classList.remove("inactive");
      dataWebsiteLink.textContent = "Link";
      console.log("[INFO] Data Website link updated:", websiteLink);
    } else if (dataWebsiteLink) {
      dataWebsiteLink.classList.add("inactive");
      dataWebsiteLink.removeAttribute("href");
    }
  };

  // Update Freeze status (both sections)
  const updateFreezeStatus = (latestData) => {
    const freezeData = latestData["🥶 Freeze Auth"];
    const updateStatusForElement = (elementId) => {
      const outputEl = document.getElementById(elementId);
      const dataId =
        "data" + elementId.charAt(0).toUpperCase() + elementId.slice(1);
      if (outputEl) {
        const icon = outputEl.querySelector("i");
        const span = outputEl.querySelector("span");
        if (icon) {
          icon.className =
            freezeData && freezeData.includes("Revoked")
              ? "fas fa-check-circle success"
              : "fas fa-times-circle danger";
        }
        if (span) {
          span.textContent = "Freeze";
        }
      }
      const dataEl = document.getElementById(dataId);
      if (dataEl) {
        dataEl.innerHTML = `<i class="${
          freezeData && freezeData.includes("Revoked")
            ? "fas fa-check-circle success"
            : "fas fa-times-circle danger"
        }"></i> Freeze`;
      }
    };
    updateStatusForElement("freezeStatus");
    console.log("[INFO] Freeze status updated:", freezeData);
  };

  // Update Mint status (both sections)
  const updateMintStatus = (latestData) => {
    const mintData = latestData["🌿 Mint Auth"];
    const updateStatusForElement = (elementId) => {
      const outputEl = document.getElementById(elementId);
      const dataId =
        "data" + elementId.charAt(0).toUpperCase() + elementId.slice(1);
      if (outputEl) {
        const icon = outputEl.querySelector("i");
        const span = outputEl.querySelector("span");
        if (icon) {
          icon.className =
            mintData && mintData.includes("Revoked")
              ? "fas fa-check-circle success"
              : "fas fa-times-circle danger";
        }
        if (span) {
          span.textContent = "Mint";
        }
      }
      const dataEl = document.getElementById(dataId);
      if (dataEl) {
        dataEl.innerHTML = `<i class="${
          mintData && mintData.includes("Revoked")
            ? "fas fa-check-circle success"
            : "fas fa-times-circle danger"
        }"></i> Mint`;
      }
    };
    updateStatusForElement("mintStatus");
    console.log("[INFO] Mint status updated:", mintData);
  };

  // Update DEX status (both sections)
  const updateDexStatus = (latestData) => {
    const dexData = latestData["🦅 Dexscreener"] || [];
    const isPaid = dexData.some((line) =>
      line.toLowerCase().includes("paid")
    );
    const updateStatusForElement = (elementId) => {
      const outputEl = document.getElementById(elementId);
      const dataId =
        "data" + elementId.charAt(0).toUpperCase() + elementId.slice(1);
      if (outputEl) {
        const icon = outputEl.querySelector("i");
        const span = outputEl.querySelector("span");
        if (icon) {
          icon.className = isPaid
            ? "fas fa-times-circle danger"
            : "fas fa-check-circle success";
        }
        if (span) {
          span.textContent = "DEX";
        }
      }
      const dataEl = document.getElementById(dataId);
      if (dataEl) {
        dataEl.innerHTML = `<i class="${
          isPaid ? "fas fa-times-circle danger" : "fas fa-check-circle success"
        }"></i> DEX`;
      }
    };
    updateStatusForElement("dexStatus");
    console.log("[INFO] DEX status updated:", isPaid ? "Paid" : "Enabled");
  };

  // Update Locked status (both sections)
  const updateLockedStatus = (latestData) => {
    const lockedData = latestData["💧 Liq"] || latestData["💧 LIQ"];
    const isLocked =
      lockedData && (lockedData.includes("Raydium") || lockedData.includes("SOL"));
    const updateStatusForElement = (elementId) => {
      const outputEl = document.getElementById(elementId);
      const dataId =
        "data" + elementId.charAt(0).toUpperCase() + elementId.slice(1);
      if (outputEl) {
        const icon = outputEl.querySelector("i");
        const span = outputEl.querySelector("span");
        if (icon) {
          icon.className = isLocked
            ? "fas fa-check-circle success"
            : "fas fa-times-circle danger";
        }
        if (span) {
          span.textContent = "Locked";
        }
      }
      const dataEl = document.getElementById(dataId);
      if (dataEl) {
        dataEl.innerHTML = `<i class="${
          isLocked ? "fas fa-check-circle success" : "fas fa-times-circle danger"
        }"></i> Locked`;
      }
    };
    updateStatusForElement("lockedStatus");
    console.log("[INFO] Locked status updated:", isLocked ? "Enabled" : "Disabled");
  };

  // --- CTO/Dev Status Update (Community Status) ---
  function getCTOStatusFromAPI(dexscreenerData) {
    if (!Array.isArray(dexscreenerData)) return false;
    const ctoLine = dexscreenerData.find((line) => line.includes("CTO:"));
    if (ctoLine) {
      return ctoLine.includes("✅");
    }
    return false;
  }

  function updateCTOOrDevStatus(isCTO = true, devLink = null) {
    // Update output community status
    const communityStatus = document.querySelector(".community-status");
    if (communityStatus) {
      if (isCTO) {
        communityStatus.innerHTML = `
          <div class="community-icons">
            <i class="fas fa-users success"></i>
          </div>
          <span class="community-label success">CTO</span>`;
      } else {
        communityStatus.innerHTML = `
          <div class="community-icons">
            <i class="fas fa-user" style="color: rgba(255, 255, 255, 0.5);"></i>
          </div>
          <span class="community-label" style="color: rgba(255, 255, 255, 0.5); cursor: pointer;"
                title="Click for Dev's token launch history">
                <a href="${devLink}" target="_blank" style="color: rgba(255, 255, 255, 0.5); text-decoration: none;">Dev</a>
          </span>`;
      }
    }
    // Update data-field CTO/Dev text
    const dataCTODev = document.getElementById("dataCTODev");
    if (dataCTODev) {
      dataCTODev.textContent = isCTO ? "CTO" : "Dev";
    }
  }

  async function fetchAndUpdateCTOOrDevStatus() {
    try {
      const response = await fetch(
        // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/fetchData"
        "http://localhost:3000/fetchData"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const dexscreenerData = data.find(
        (item) => item["🦅 Dexscreener"]
      )?.["🦅 Dexscreener"];
      const solscanLinks = data.find((item) => item.solscanLinks)?.solscanLinks;
      if (dexscreenerData) {
        const isCTO = getCTOStatusFromAPI(dexscreenerData);
        const devLink = solscanLinks?.[1] || null;
        updateCTOOrDevStatus(isCTO, devLink);
      } else {
        console.warn(
          "[CTO/Dev Status] Dexscreener data not found in the API response."
        );
      }
    } catch (error) {
      console.error("[CTO/Dev Status] Error fetching or updating status:", error);
    }
  }

  // --- Event Listeners ---
  const addressInput = document.querySelector(".address-input");
  if (addressInput) {
    addressInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const contractAddress = e.target.value.trim();
        if (!contractAddress) {
          console.warn("[WARNING] Contract address is empty!");
          return;
        }
        console.log(
          "[INFO] New contract address entered. Resetting fields:",
          contractAddress
        );
        try {
          resetFields();
        } catch (error) {
          console.error(
            "[ERROR] An error occurred while resetting fields:",
            error
          );
          return;
        }
        try {
          await clearAPIData();
          console.log("[INFO] API data cleared successfully.");
        } catch (error) {
          console.error("[ERROR] Failed to clear API data:", error);
          return;
        }
        console.log(
          "[INFO] Sending contract address to Telegram bot:",
          contractAddress
        );
        try {
          await sendContractAddressToBot(contractAddress);
        } catch (error) {
          console.error(
            "[ERROR] An error occurred while sending contract address to the bot:",
            error
          );
        }
      }
    });
  }

  // Initial and periodic data fetching & CTO/Dev status updates
  setInterval(fetchData, 3000);
  fetchData();
  fetchAndUpdateCTOOrDevStatus();
  setInterval(fetchAndUpdateCTOOrDevStatus, 3000);
});