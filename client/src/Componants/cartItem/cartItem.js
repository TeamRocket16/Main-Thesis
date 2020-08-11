import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      width: 200,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));

function CartItem(props){
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  //the one single item style for one order
  //pass in the element obj from database by the name of element
    return (
        <div class="cards">
        <Card className={classes.root}>
          <CardHeader //title
            title={props.element.mealName}
          />
          <CardMedia
            className={classes.media}
            image={props.element.image}
            title="Paella dish"
          />
          <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            price : {props.element.price}
            {/* amount: {props.element.amount} */}
          </Typography>
        </CardContent>
        </Card>
      </div>
    )
}

export default CartItem;