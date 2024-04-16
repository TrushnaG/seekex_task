import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import BucketService from '../services/bucket.service';
import { toast } from 'react-toastify';

const PlaceBall = () => {
  const [ballList, setBallList] = useState([]);
  const [ballInputs, setBallInputs] = useState({});
  const [suggetBucket, setSuggestBucket] = useState("")
  
  useEffect(() => {
    fetchBallList();
  }, []);

  const fetchBallList = async () => {
    try {
      const response = await BucketService.getBallList();
      if (response.data.success === true) {
        setBallList(response.data.data);
        // Initialize ballInputs state with default values
        const initialBallInputs = {};
        response.data.data.forEach(ball => {
          initialBallInputs[ball.id] = '';
        });
        setBallInputs(initialBallInputs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch ball list. Please try again later.');
    }
  };

  const handleInputChange = (e, ballId) => {
    const value = e.target.value;
    const parsedValue = parseInt(value); 
    setBallInputs(prevState => ({
      ...prevState,
      [ballId]: isNaN(parsedValue) ? '' : parsedValue
    }));
  };

  const handleSave = async () => {
    try {
      if (!ballList.length) {
        toast.error('Ball list is empty. Please try again later.');
        return;
      }
      const ballArray = Object.entries(ballInputs).map(([ballId, quantity]) => ({
        ball_id: parseInt(ballId),
        quantity: parseInt(quantity)
      }));
      const response = await BucketService.placeBall(ballArray);
      if (response.success === true) {
        // Display success message
        toast.success(response.message);
      } else {
        // Display error message
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSuggestBucket = async () => {
    try {
      if (!ballList.length) {
        toast.error('Ball list is empty. Please try again later.');
        return;
      }
      const ballArray = Object.entries(ballInputs).map(([ballId, quantity]) => ({
        ball_id: parseInt(ballId),
        quantity: parseInt(quantity)
      }));
      const response = await BucketService.getSuggestBucket(ballArray);
      if (response.success === true) {
        // Display success message
        setSuggestBucket(response.data.suggetBucket)
        toast.success(response.message);
      } else {
        // Display error message
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Place Ball in Bucket
      </Typography>
      <Grid container spacing={2}>
        {ballList?.map(ball => (
          <Grid item xs={12} key={ball.id}>
            <TextField
              label={ball.name}
              variant="outlined"
              fullWidth
              type="number"
              value={ballInputs[ball.id]}
              onChange={(e) => handleInputChange(e, ball.id)}
            />
          </Grid>
       
        ))}
          {suggetBucket !== 0 ? (
          <Grid item xs={12}>
            <Typography variant="subtitle1">Suggested Bucket: {suggetBucket}</Typography>
          </Grid>
        ) : ""}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" style={{ marginRight: '8px' }} onClick={handleSave}>
            Place Ball
          </Button>
          <Button variant="contained" onClick={handleSuggestBucket}>
            Suggest Bucket
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlaceBall;
