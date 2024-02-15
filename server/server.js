const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3001;

const { initializeApp, cert } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const serviceAccount = require("./bestbuy-price-notifier-firebase-adminsdk-1buz2-8587967664.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.use(cors());

app.get("/getData", async (req, res) => {
  console.log("AFTER");
  const productURL = req.query.productURL;
  const userID = req.query.userID;
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
    const productName = productPageData[0].sku.names.short;
    console.log(productPageData[0].sku);
    // console.log(productPageData[0].sku.price.currentPrice);

    await addProductToUserAccount(userID, productSKU, productName);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

async function addProductToUserAccount(userID, productSKU, productName) {
  console.log("ADDING PRODUCT WITH SKU: ", productSKU, "to user account");
  // const snapshot = await db.collection("users").get();
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, "=>", doc.data());
  // });

  const docRef = db
    .collection("users")
    .doc(userID)
    .collection("trackedProducts")
    .doc(productSKU);
  await docRef.set({
    name: productName,
    amountPaid: 1299,
    dateOfPurchase: "Today",
  });
}

app.listen(port, () => {
  console.log("server is running");
});
