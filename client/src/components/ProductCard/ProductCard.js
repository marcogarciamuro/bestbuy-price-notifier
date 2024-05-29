import React from "react";
import "./ProductCard.css";

function ProductCard(props) {
  function convertDate(isoDate) {
    const date = new Date(isoDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  return (
    <div className="product-card-wrapper">
      <div className="product-detail title">{props.product.name}</div>
      <div className="product-detail price-paid">
        ${props.product.pricePaid}
      </div>
      <div className="product-detail current-price">
        ${props.product.currentPrice}
      </div>
      <div className="product-detail on-sale">
        {props.product.currentPrice < props.product.pricePaid ? "Yes" : "No"}
      </div>
      <div className="product-detail purchase-date">
        {props.product.purchaseDate}
      </div>
      <div className="product-detail days-left">
        {props.product.daysLeftToPriceMatch}
      </div>
    </div>
  );
}

export default ProductCard;
