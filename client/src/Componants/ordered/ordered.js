import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import './ordered.css';
import CartItem from '../cartItem/cartItem'

function Order() {
  const [orders, setOrders] = useState([]);

  var userId = localStorage.getItem("tokenIdBusiness");
  console.log(userId, "-----");

  //find all uesers ordered items .. 
  useEffect(() => {
    axios
      .get(`/order/find/${userId}`)
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err, "err catching data");
      });
  }, [])
  
  // mealId: req.body.mealId,
  // UserId: req.body.UserId,
  // quantity: req.body.quantity,
  //handle the click sending data to the database
const handleClick =() =>{
    // axios.post('/meal/pending/147111',{mealId:orders.idMeal,userId:${userId},quantity:});
  }

//map thro every singel item and display it
  return (
   <div>
      <div className="cards"> 
        {orders.map((element, index) => {
            return (
              <div key={index}>
                <CartItem element={element} />
              </div>
            );
          })}
       </div>
        <Button variant="contained" id="btn" onClick={handleClick} >
            buy
          </Button>
   </div>
  
  );
}

export default Order;
