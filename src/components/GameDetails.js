import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

function GameDetails() {
  const { gameName } = useParams();
  const [gameData, setGameData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchGameData = async () => {
      const gameDocRef = doc(db, "editors", gameName);
      const gameDoc = await getDoc(gameDocRef);
      if (gameDoc.exists()) {
        setGameData(gameDoc.data());
      }

      const categoriesCollection = collection(db, "editors", gameName);
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
        };
      });
      setCategories(categoriesList);
    };

    fetchGameData();
  }, [gameName]);

  if (!gameData) {
    return <p>Loading...</p>;
  }

  return (
    <Box display="flex" flexDirection="column" pt={4}>
      <Typography variant="h3" component="h1">
        {gameName}
      </Typography>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={category.image}
                alt={category.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default GameDetails;
