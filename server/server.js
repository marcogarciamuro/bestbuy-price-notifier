const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3001;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./bestbuy-price-notifier-firebase-adminsdk-1buz2-8587967664.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

class Product {
  constructor(
    sku,
    url,
    name,
    pricePaid,
    currentPrice,
    purchaseDate,
    daysLeftToPriceMatch
  ) {
    this.sku = sku;
    this.url = url;
    this.name = name;
    this.pricePaid = pricePaid;
    this.currentPrice = currentPrice;
    this.purchaseDate = purchaseDate;
    this.daysLeftToPriceMatch = daysLeftToPriceMatch;
  }
}

app.use(cors());

app.get("/getData", async (req, res) => {
  const productUrl = req.query.productUrl;
  const userId = req.query.userId;
  const pricePaid = req.query.pricePaid;
  const productSku = req.query.productUrl.slice(-7);
  const purchaseDate = req.query.purchaseDate;
  console.log(req.query);
  const apiEndpoint = `https://www.bestbuy.com/priceview/query/sku?_lazyHydrate=true&buyingOptionsOnly=true&context=PDP-PostCard-BuyingOptions&destinationZipCode=95407&deviceClass=l&effectivePlanPaidMemberType=NULL&includes=buyNowPayLater%2CdealExpirationTimer%2Coffers%2Cprice%2CpriceBadge%2CskuDataAnalytics%2CtotalTechPrice%2CtotalTechSavings%2CtradeInMessaging%2CupgradePlusCitizenOption&layout=large&planPaidMember=false&skuId=${productSku}&viewType=price&vt=1b94360d-c1a0-11ee-a37d-06049a89920b`;
  try {
    console.log("Visiting: ", productUrl);
    const productInfo = await fetchData(apiEndpoint, productUrl);
    const regularPrice = productInfo.skuDataAnalytics.regularPrice;
    const curPrice = productInfo.skuDataAnalytics.customerPrice;
    const memberPrice = productInfo.totalTechPrice;
    const lowestPrice = memberPrice;
    const onSale = productInfo.skuDataAnalytics == "savings";
    const saleEndDate = productInfo.showDealExpirationTimer
      ? productInfo.dealExpirationTimeStamp
      : null;

    const productName = await getProductName(productSku);
    const daysLeftToPriceMatch = getDaysLeftToPriceMatch(userId, purchaseDate);
    console.log("purchase date", purchaseDate);
    console.log(daysLeftToPriceMatch);

    const product = new Product(
      productSku,
      productUrl,
      productName,
      pricePaid,
      curPrice,
      purchaseDate,
      daysLeftToPriceMatch
    );
    console.log("sending:", product);

    // check if product isn't already in user's account
    const alreadyTracked = await productIsAlreadyTracked(userId, productSku);
    console.log(alreadyTracked);
    if (!alreadyTracked) {
      console.log("here");
      await addProductToUserAccount(userId, product);
    } else {
      console.log("Product is already in user's account");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

function getDaysLeftToPriceMatch(userId, purchaseDateStr) {
  const returnPeriodInDays = getUserHasMembership(userId) ? 60 : 15;
  const purchaseDate = new Date(purchaseDateStr);
  var lastDayToPriceMatch = new Date(purchaseDate.valueOf());
  lastDayToPriceMatch.setDate(
    lastDayToPriceMatch.getDate() + returnPeriodInDays
  );
  const today = new Date();
  const daysLeft = Math.round(
    (lastDayToPriceMatch - today) / (1000 * 60 * 60 * 24)
  );
  return daysLeft < 0 ? 0 : daysLeft;
}

async function getUserHasMembership(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getProductName(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data().hasMembership;
    }
  } catch (error) {
    console.log("Error getting user membership status");
    return false;
  }
}

async function fetchData(apiEndpoint, productUrl) {
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
    referer: productUrl,
    "accept-language": "en-US,en;q=0.9",
  };
  const axiosConfig = {
    headers: headers,
  };

  try {
    const response = await axios.get(apiEndpoint, axiosConfig);
    const productInfo = response.data;
    return productInfo;
  } catch (error) {
    return null;
  }
}

async function getProductName(productSku) {
  const apiEndpoint = `https://www.bestbuy.com/api/3.0/priceBlocks?skus=${productSku}`;
  const productInfo = await fetchData(apiEndpoint);
  return productInfo[0].sku.names.short;
}

async function productIsAlreadyTracked(userId, productSku) {
  const trackedProductsRef = db
    .collection("users")
    .doc(userId)
    .collection("trackedProducts");
  const docRef = trackedProductsRef.doc(productSku);
  try {
    const snapshot = await docRef.get();
    return snapshot.exists;
  } catch (error) {
    console.error("Error checking document existence:".error);
    return false;
  }
}

async function addProductToUserAccount(userId, product) {
  console.log("Adding product to user's account");
  console.log(product);
  const docRef = db
    .collection("users")
    .doc(userId)
    .collection("trackedProducts")
    .doc(product.sku);
  await docRef.set({
    sku: product.sku,
    productUrl: product.url,
    name: product.name,
    pricePaid: product.pricePaid,
    currentPrice: product.currentPrice,
    purchaseDate: product.purchaseDate,
    daysLeftToPriceMatch: product.daysLeftToPriceMatch,
  });
}

app.listen(port, () => {
  console.log("server is running");
});
