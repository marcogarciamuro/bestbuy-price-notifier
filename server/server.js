const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3001;

app.use(cors());

app.get("/getData", async (req, res) => {
  const productURL = req.query.link;
  const productSKU = req.query.link.slice(-7);
  const apiEndPoint = `https://www.bestbuy.com/api/3.0/priceBlocks?skus=${productSKU}`;
  const headers = {
    authority: "www.bestbuy.com",
    pragma: "no-cache",
    "cache-control": "no-cache",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    accept: "*/*",
    "sec-fetch-Dest": "empty",
    "sec-fetch-Mode": "cors",
    "sec-fetch-Site": "same-origin",
    referer: productURL,
    "accept-language": "en-US,en;q=0.9",
  };
  const axiosConfig = {
    headers: headers,
  };
  try {
    console.log("Visiting: ", productURL);
    const response = await axios.get(apiEndPoint, axiosConfig);
    const productPageData = response.data;
    console.log(productPageData[0].sku.price.currentPrice);

    // compare this price with saved price
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("server is running");
});
