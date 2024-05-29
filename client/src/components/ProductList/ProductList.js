import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";
import _ from "lodash";

function ProductList(props) {
  const labels = [
    "Product",
    "Purchase Price",
    "Current Price",
    "On Sale",
    "Purchase Date",
    "Days Left",
  ];
  return (
    <div className="product-list">
      <div className="label-list">
        {_.map(labels, (label) => (
          <div className="label">{label}</div>
        ))}
      </div>
      <div className="products">
        {Array.isArray(props.products) && props.products.length > 0 ? (
          props.products.map((product, index) => {
            return (
              <ProductCard
                key={index}
                product={product}
                userHasMembership={props.userHasMembership}
              />
            );
          })
        ) : (
          <h1>No Products</h1>
        )}
      </div>
    </div>
  );
}

export default ProductList;
