import React, { useEffect, useState } from 'react';
import ItemsCarousel from 'react-items-carousel';
import 'react-multi-carousel/lib/styles.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    maxWidth: 240,
    background: '	#f64f0f',
    height: 430,
  },
  media: {
    height: 380,
  },
  text: {
    textAlign: 'center',
    fontSize: '28px',
    color: 'White',
    fontFamily: 'Open Sans',
    marginTop: '-10px',
  },
});

function Meals() {
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    axios
      .get('/business')
      .then((res) => {
        var arr = [];
        var arrRest = res.data;
        console.log(arrRest);
        for (var i = 0; i < arrRest.length; i++) {
          if (arrRest[i].meal !== []) {
            for (var j = 0; j < arrRest[i].meal.length; j++) {
              arr.push(arrRest[i].meal[j]);
            }
          }
        }
        setMeals(arr);
        // setRestaurants(arrBusiness);
      })
      .catch((err) => {
        console.log(err, 'err catching data');
      });
  }, []);
  console.log('meals', meals);

  var mealsView = () => {
    for (var i = 0; i < meals.length; i++) {
      return (
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia className={classes.media} image={meals[i].image} />
            <CardContent>
              <Typography className={classes.text} gutterBottom variant='h5'>
                {meals[i].mealName}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions></CardActions>
        </Card>
      );
    }
  };
  // function comparePrice(a, b) {
  //   var aDate = a.date;
  //   var bDate = b.date;
  //   if (aDate < b.date) {
  //     return 1;
  //   }
  //   // if (new Date() > bDate) {
  //   //   return -1;
  //   // }
  //   return 0;
  // }

  // meals.sort(comparePrice);
  // console.log('restaurants', meals);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
  };
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 10;
  const classes = useStyles();
  return (
    <section id='services'>
      <section id='features'>
        <div className='mealslist'>Top Meals</div>
        <ItemsCarousel
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          numberOfCards={6}
          gutter={4}
          leftChevron={<button>{'<'}</button>}
          rightChevron={<button>{'>'}</button>}
          outsideChevron
          chevronWidth={chevronWidth}
        >
          {meals
            .slice(0, 6)
            .reverse()
            .map((elem) => {
              return (
                <Card className={classes.root}>
                  <CardActionArea>
                    <CardMedia className={classes.media} image={elem.image} />
                    <CardContent>
                      <Typography
                        className={classes.text}
                        gutterBottom
                        variant='h5'
                      >
                        {elem.mealName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions></CardActions>
                </Card>
              );
            })}
        </ItemsCarousel>
      </section>
    </section>
  );
}

export default Meals;
