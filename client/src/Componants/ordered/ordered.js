import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import './ordered.css';
import CartItem from '../cartItem/cartItem';
//find all uesers ordered items ..

function Order() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);

  // const [value, setValue] = useState([]);
  // const [ele, setEle] = useState([]);

  useEffect(() => {
    axios
      .get(`/order/find/${userId}`)
      .then((res) => {
        if (res.data.length !== 0) {
          console.log(res.data);
          for (var key in res.data) {
            if (res.data[key].length === 0) {
              delete res.data[key];
            }
          }
          setOrders(res.data);
          setCount(count + 1);
        }
      })
      .catch((err) => {
        console.log(err, 'err catching data');
      });
  }, [count]);

  var userId = localStorage.getItem('tokenIdBusiness');
  //console.log(userId, '-----');

  //refresh the page
  // function refreshPage() {
  //   window.location.reload(false);
  // }

  const handleClick = (id) => {
    var value = id;
    var idBusiness = value[0].resId;
    // console.log(value);
    for (var i = 0; i < value.length; i++) {
      console.log(value[i].idMeal);
      console.log(value[i].mealAmount);
      axios
        .post(`/meal/pending/${idBusiness}`, {
          mealId: value[i].idMeal,
          UserId: userId,
          quantity: value[i].mealAmount,
        })
        .then((res) => {
          console.log('done' + res.data);
        })
        .catch((err) => {
          console.log(err + 'err catching data');
        });
    }
    console.log('req done');

    // deleteAllOrders(idBusiness);
    window.location.href = '/userPayment';
    // refreshPage();
  };

  //refresh the basket all over again
  // function deleteAllOrders(resId) {
  //   var userId = localStorage.getItem("tokenIdBusiness");
  //   axios
  //     .put(`/order/remove/${userId}`, {
  //       resId: resId,
  //     })
  //     .then((res) => {
  //       console.log("all refreshed successfully" + res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err + "err deleteing data");
  //     });
  // }
  const returnToRest = () => {
    window.location.href = '/userpage';
  };

  //map thro every singel item and display it
  var keys = Object.keys(orders);

  // console.log(orders[keys[0]] && orders[keys[0]].length);
  if ((orders[keys[0]] && orders[keys[0]].length === 0) || keys.length === 0) {
    return (
      <div>
        <button
          id='btn'
          variant='contained'
          onClick={returnToRest}
          style={{ border: 'none', padding: '5px 9px', outline: 'none' }}
        >
          back to restaurants
        </button>
        <h1>No meals in cart</h1>
      </div>
    );
  } else {
    return (
      <div>
        <button
          id='btn'
          variant='contained'
          onClick={returnToRest}
          style={{ border: 'none', padding: '5px 9px' }}
        >
          back to restaurants
        </button>
        <div className='cards'>
          {keys.map((ele) => {
            var totalPrice = 0;
            var value = orders[ele];
            return (
              <div id='cart'>
                <div className='cards' id='cards'>
                  {value.map((element, index) => {
                    totalPrice += element['price'] * element['mealAmount'];
                    //    console.log(element['price']);
                    return (
                      <div key={index}>
                        <CartItem element={element} />
                      </div>
                    );
                    // console.log(totalPrice);
                  })}
                </div>
                <span id='orderConfirm'>
                  <h5 id='price'> total price :{totalPrice} USD</h5>
                  <Button
                    variant='contained'
                    id='btn'
                    onClick={() => {
                      handleClick(value);
                    }}
                    className='btn'
                    style={{ marginLeft: '325px', marginBottom: '2px' }}
                  >
                    confirm {'>>'}
                  </Button>
                  {/* <Button variant='contained' id='btn' onClick={deleteAllOrders}>
                    deleteAll
                  </Button> */}
                </span>
              </div>
            );
            // i = i + 1;
          })}
        </div>
      </div>
    );
  }
}

export default Order;
