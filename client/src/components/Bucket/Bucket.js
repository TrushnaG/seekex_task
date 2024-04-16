import React, { useState } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import validator from 'validator';
import { toast } from 'react-toastify';
import BucketService from '../services/bucket.service';

const Bucket = () => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Bucket Name is required';
    }
    if (!capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (!validator.isNumeric(capacity)) {
      newErrors.capacity = 'Capacity must be a number';
    } else if (parseInt(capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBucket = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await BucketService.createNewBucket({ name, capacity });
      if (response.data.success === true) {
        // Display success message
        toast.success(response.data.message);
        // Reset form fields
        setName('');
        setCapacity('');
      } else {
        // Display error message
        toast.error(response.data.message);
      }
    } catch (error) {
      // Display error message if request fails
      toast.error('Failed to create bucket. Please try again later.');
    }
  };

  return (
    <form>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Create New Bucket
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Bucket Name"
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
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            error={!!errors.capacity}
            helperText={errors.capacity}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleCreateBucket}>
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Bucket;
