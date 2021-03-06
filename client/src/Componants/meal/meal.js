import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './meal.css';
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    width: 400
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function Meal(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  //value of the input "AMOUNT"
  const [value, setValue] = useState(1);

  //onChange the input of the amount
  const handleChange = e => {
    setValue(e.target.value);
  };

  //the meal component for the meals in the menu ..
  return (
    <div className='cards' id='cardStyle'>
      <Card className={classes.root}>
        <CardHeader //title
          title={props.element.mealName}
          style={{
            backgroundColor: '#f64f0f',
            color: 'white',
            textAlign: 'center'
          }}
        />
        <CardMedia
          className={classes.media}
          image={props.element.image}
          title='Paella dish'
          style={{ backgroundColor: '', color: '' }}
        />
        <CardContent style={{ backgroundColor: '', color: 'white' }}>
          <Typography
            variant='body2'
            color='textSecondary'
            component='p'
            style={{ color: '', margin: '0px' }}
          >
            price : {props.element.price}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <input id={props.element.idMeal} value={value} type='checkbox' />
          <input
            type='number'
            id='number'
            value={props.inputVal === true ? 1 : value}
            onChange={handleChange}
            min='1'
            max={props.element.mealAmount}
          />
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Typography>{props.element.discription}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
