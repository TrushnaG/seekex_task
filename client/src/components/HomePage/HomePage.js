import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Grid, Box } from '@mui/material';
import Bucket from '../Bucket';
import Ball from '../Ball';
import PlaceBall from '../PlaceBall/PlaceBall';
import Result from '../Result/Result';

const HomePage = () => {
    const [showForm, setShowForm] = useState(null);

    const handleCreateFormClick = (formType) => {
        setShowForm(formType);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to Bucket App
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={() => handleCreateFormClick('bucket')}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Create Bucket
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={() => handleCreateFormClick('ball')}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Create Ball
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={() => handleCreateFormClick('place-ball')}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Place Ball
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={() => handleCreateFormClick('result')}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Result
                    </Button>
                </Grid>
            </Grid>

            {showForm === "bucket" &&
                <Box mt={4} p={3} alignItems="center" sx={{ border: '1px solid black' }}>
                    <Bucket />
                </Box>
            }

            {showForm === "ball" &&
                <Box mt={4} p={3} alignItems="center" sx={{ border: '1px solid black' }}>
                    <Ball />
                </Box>
            }

            {showForm === "place-ball" && 
                <Box mt={4} p={3} alignItems="center" sx={{ border: '1px solid black' }}>
                    <PlaceBall />
                </Box>
            }
            {showForm === "result" &&
                <Box mt={4} p={3} alignItems="center" sx={{ border: '1px solid black' }}>
                    <Result />
                </Box>
            }
        </Container>
    );
};

export default HomePage;
