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
  toString() {
    return this.name + ", " + this.sku + ", ";
  }
  getDaysLeftToPriceMatch(returnPeriodInDays) {
    const purchaseDate = new Date(this.purchaseDate);
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
}

export const productConverter = {
  fromFirestore: function (snapshot) {
    const data = snapshot.data();
    return new Product(
      data.sku,
      data.url,
      data.name,
      data.pricePaid,
      data.currentPrice,
      data.purchaseDate,
      data.daysLeftToPriceMatch
    );
  },
};

export default Product;
