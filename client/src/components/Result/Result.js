import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import BucketService from '../services/bucket.service';
import { toast } from 'react-toastify';

const Result = () => {
  const [bucketList, setBucketList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBucketList();
  }, []);

  const fetchBucketList = async () => {
    try {
      const response = await BucketService.getBucketList();
      if (response.data.success === true) {
        setBucketList(response.data.data);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch bucket list. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after data fetching is complete
    }
  };

  const renderPlaceBalls = (balls) => {
    if (balls.length === 0) return 'Empty Bucket';
    return balls.map((ball, index) => (
      <React.Fragment key={ball.id}>
        {index > 0 && ', '}
        {ball.bucket_balls.quantity} {ball.name} {ball.bucket_balls.quantity > 1 ? "balls" : "ball"}
      </React.Fragment>
    ));
  };

  return (
    <div>
    {loading ? (
      <p>Loading...</p> // Show loading message while fetching data
    ) : ( <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Bucket Name</TableCell>
            <TableCell>Placed Ball</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bucketList?.map(bucket => (
            <TableRow key={bucket.id}>
              <TableCell>{bucket.id}</TableCell>
              <TableCell>{bucket.name}</TableCell>
            <TableCell>{renderPlaceBalls(bucket.balls)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
     )}
     </div>
  );
};

export default Result;
