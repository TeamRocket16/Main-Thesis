import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import swal from 'sweetalert';

var token = localStorage.getItem('tokenIdBusiness');

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    width: 270,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

function Orders() {
  const classes = useStyles();

  const [counter, setCounter] = useState(0);
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState(null)
  var [clientss, setClients] = useState({});

  useEffect(() => {
    async function rendering() {
      axios
        .get(`/meal/pending/${token}`)
        .then(async (response) => {
          var clients = response.data;
          console.log(response.data);
          // setOrders(response.data);
          setClients(clients);
          clientss = clients;

          ////////////////////////////
          var x = [];
          for (var key in clientss) {
            var id = key;
            console.log(id);
            let response = await axios.get(`/user/login/${id}`);

            var user = response.data;

            var obj = {
              id: 0,
              name: '',
              phone: 0,
              orders: [],
            };

            obj.id = id;
            obj.name = user.FullName;
            obj.phone = user.Phone;
            obj.orders = clientss[key];
            x.push(obj);
          }

          setOrders(x);
          console.log(x);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    rendering();
  }, [counter]);

  let decrement = (e) => {
    var mealId = e.target.name;
    var amount = e.target.value;
    axios
      .post(`/business/meal/pendingOne/${token}`, {
        mealId: mealId,
        mealAmount: amount,
      })
      .then((response) => {
        console.log();
        console.log('quantitiy updated');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let test = async (e) => {
    var userid = e.target.name;
    var phone = e.target.value
    var checkboxes = document.getElementsByTagName('input');
    console.log(checkboxes);
    var message = '';
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked === true) {
        var mealid = checkboxes[i].name;
        var amount = checkboxes[i].value;

        console.log('looping');

        var response1 = await axios.post(`/business/meal/pendingOne/${token}`, {
          mealId: mealid,
          mealAmount: amount,
        });
        message = response1.data;

        var response2 = await axios.post(`/meal/done/${token}`, {
          mealId: mealid,
          UserId: userid,
          quantity: amount,
        });

        var response3 = await axios.post(`/business/meal/pending/${token}`, {
          mealId: mealid,
          userId: userid,
        });
      }
    }
    swal({
      title: message,
      text: 'Meal Updated',
      icon: 'success',
      button: 'Done',
    });
    setCounter(counter + 1);
  };

  // let test = (e) => {
  //   var userid = e.target.name;
  //   var checkboxes = document.getElementsByTagName('input');
  //   console.log(checkboxes);
  //   var message = '';
  //   for (var i = 0; i < checkboxes.length; i++) {
  //     if (checkboxes[i].checked === true) {
  //       var mealid = checkboxes[i].name;
  //       var amount = checkboxes[i].value;

  //       console.log('looping');

  //       axios
  //         .post(`/business/meal/pendingOne/${token}`, {
  //           mealId: mealid,
  //           mealAmount: amount,
  //         })
  //         .then((response) => {
  //           console.log('Hello then, success ');

  //           // swal(response.data, 'Meal updated!', 'success', 'done');
  //           message = response.data;
  //           // swal({
  //           //   title: response.data,
  //           //   text: 'Meal Updated',
  //           //   icon: 'success',
  //           //   button: 'Done',
  //           // });
  //           ////////////////////////////////////
  //           axios
  //             .post(`/meal/done/${token}`, {
  //               mealId: mealid,
  //               UserId: userid,
  //               quantity: amount,
  //             })
  //             .then((response) => {
  //               console.log('DONNEE');
  //               /////////////////////////////////////
  //               axios
  //                 .post(`/business/meal/pending/${token}`, {
  //                   mealId: mealid,
  //                   userId: userid,
  //                 })
  //                 .then((response) => {
  //                   console.log('successfully removed from pending');
  //                 })
  //                 .catch((err) => {
  //                   console.log('failed to remove from pending', err);
  //                 });
  //             })
  //             .catch((err) => {
  //               console.log('failed to move to done', err);
  //             });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //     swal({
  //       title: message,
  //       text: 'Meal Updated',
  //       icon: 'success',
  //       button: 'Done',
  //     });
  //     setCounter(counter + 1);
  //   }
  // };

  return (
    <div>
      <h1>ORDERS</h1>
      {orders.map((Element, index) => {
        var phone = Element.phone
        if (Element.orders.length > 0) {
          return (
            <div key={index} className='orders'>
              <div>
                <h3>
                  Client: &nbsp;
                  {Element.name}
                </h3>
                <h3>
                  Phone Number: &nbsp;
                  {Element.phone}
                </h3>
              </div>
              <div className='orders'>
                {Element.orders.map((Element2, index2) => {
                  return (
                    <div className='card1' key={index2}>
                      <img
                        src={Element2.image}
                        alt='Avatar'
                        style={{ width: '100%', height: '240px' }}
                      />
                      <div
                        className='container1'
                        style={{ backgroundColor: 'white' }}
                      >
                        <h4>
                          <b>{Element2.mealName}</b>
                          <br />
                          <span>{Element2.mealAmount} orders</span>
                        </h4>
                        <input
                          type='checkbox'
                          name={Element2.idMeal}
                          value={Element2.mealAmount}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                variant='contained'
                id='btn'
                onClick={test}
                value={phone}
                name={Element.id}
              >
                Confirm
              </button>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Orders;
