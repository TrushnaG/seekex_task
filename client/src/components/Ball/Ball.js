import React, { useState } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import BucketService from '../services/bucket.service';
import validator from 'validator';
import { toast } from 'react-toastify';

const Ball = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Ball Name is required';
    }
    if (!size.trim()) {
      newErrors.size = 'Volume is required';
    } else if (!validator.isNumeric(size)) {
      newErrors.size = 'Volume must be a number';
    } else if (parseInt(size) <= 0) {
      newErrors.size = 'Volume must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBall = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await BucketService.createNewBall({ name, size });
      if (response.data.success === true) {
        // Display success message
        toast.success(response.data.message);
        // Reset form fields
        setName('');
        setSize('');
      } else {
        // Display error message
        toast.error(response.data.message);
      }
    } catch (error) {
      // Display error message if request fails
      toast.error('Failed to create ball. Please try again later.');
    }
  };

  return (
    <form >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Create New Ball
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Ball Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Volume (in Inches)"
            variant="outlined"
            fullWidth
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            error={!!errors.size}
            helperText={errors.size}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleCreateBall}>
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Ball;
