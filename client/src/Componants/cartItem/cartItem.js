import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import axios from 'axios';
import './cartItem.css';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    width: 220,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function CartItem(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  // const [counter,setCounter] = useState(0);
  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

  //refresh the page
  function refreshPage() {
    window.location.reload(false);
  }

  //delete function fot the meal
  const deleteMeal = (e) => {
    var userId = localStorage.getItem('tokenIdBusiness');
    var id = e.target.name;
    axios
      .post(`/order/remove/${userId}`, { mealId: id })
      .then((response) => {
        console.log('meal removed');
      })
      .catch((err) => {
        console.log('failed to remove', err);
      });
    refreshPage();
  };

  //the one single item style for one order
  //pass in the element obj from database by the name of element
  return (
    <div class='cards' style={{ marginTop: '20px' }}>
      <Card className={classes.root}>
        <CardHeader //title
          title={props.element.mealName}
          style={{ textAlign: 'center' }}
        />
        <CardMedia
          className={classes.media}
          image={props.element.image}
          title='Paella dish'
        />
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            price : {props.element.price} USD .. amount:{' '}
            {props.element.mealAmount}
          </Typography>
        </CardContent>
        <button
          name={props.element.idMeal}
          onClick={deleteMeal}
          style={{
            backgroundColor: 'transparent',
          }}
          id='delete'
        >
          Delete
        </button>
      </Card>
    </div>
  );
}

export default CartItem;
