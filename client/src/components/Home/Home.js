import Button from "react-bootstrap/Button";
import { useAuth } from "../../contexts/AuthContext";
import React, { useState, useEffect } from "react";
import { productConverter } from "../../Product";
import { db } from "../../firebase";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import ProductList from "../ProductList/ProductList";
import TrackNewProductModal from "../TrackNewProductModal";
import "./Home.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import _ from "lodash";

function Home() {
  const { user, logOut } = useAuth();
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userHasMembership, setUserHasMembership] = useState();
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    if (user) {
      getTrackedProducts();
      getUserHasMembership();
    }
  }, [user]);

  async function getUserHasMembership() {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserHasMembership(userDocSnap.data().hasMembership);
      }
    } catch (error) {
      console.log("Error getting user membership status");
    }
  }

  async function getTrackedProducts() {
    const products = [];
    try {
      console.log(user.uid);
      const trackedProductsRef = collection(
        db,
        "users",
        user.uid,
        "trackedProducts"
      );
      const qSnap = await getDocs(
        trackedProductsRef.withConverter(productConverter)
      );
      qSnap.docs.forEach((doc) => {
        console.log(doc.data());
        const product = productConverter.fromFirestore(doc);
        products.push(product);
      });
    } catch (error) {
      console.error("error getting documents: ", error);
    }
    console.log(products);
    setTrackedProducts((prevTrackedProducts) => [
      ...prevTrackedProducts,
      ...products,
    ]);
  }

  async function handleLogout() {
    console.log("Logging out");
    try {
      await logOut();
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className="home-wrapper">
      <div className="header">
        <h4>My Products</h4>
        <Button variant="primary" onClick={handleShow}>
          Track New Product
        </Button>

        <TrackNewProductModal show={showModal} handleClose={handleClose} />
      </div>
      <Tabs
        defaultActiveKey="all"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="all" title="All">
          <ProductList
            userHasMembership={true}
            class="tracked-products"
            products={trackedProducts}
          />
        </Tab>
        <Tab eventKey="still-eligible" title="Still Eligible">
          <ProductList
            userHasMembership={true}
            class="tracked-products"
            products={_.filter(
              trackedProducts,
              (product) => product.daysLeftToPriceMatch > 0
            )}
          />
        </Tab>
        <Tab eventKey="expired" title="Expired">
          <ProductList
            userHasMembership={true}
            class="tracked-products"
            products={_.filter(
              trackedProducts,
              (product) => product.daysLeftToPriceMatch === 0
            )}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Home;
