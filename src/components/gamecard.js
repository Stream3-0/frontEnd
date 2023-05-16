import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    position: "relative",
    overflow: "hidden",
    width: "500px",
    height: "250px",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "-2px",
      left: "-2px",
      width: "calc(100% + 4px)",
      height: "calc(100% + 4px)",
      zIndex: -1,
      background:
        "linear-gradient(45deg, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000)",
      backgroundSize: "400%",
      animation: `$steam 20s linear infinite`,
    },
    "&::after": {
      filter: "blur(50px)",
    },
  },
  card: {
    height: "100%",
    background: "linear-gradient(0deg, #000, #272727)",
    color: "#fff",
  },
  "@keyframes steam": {
    "0%": {
      backgroundPosition: "0 0",
    },
    "50%": {
      backgroundPosition: "400% 0",
    },
    "100%": {
      backgroundPosition: "0 0",
    },
  },
}));

function GameCard({ game, onClick }) {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={onClick}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={game.image || "https://via.placeholder.com/150"} // fallback image
            alt={game.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {game.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {game.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default GameCard;
