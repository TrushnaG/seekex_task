-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 16, 2024 at 03:19 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seekex_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `balls`
--

CREATE TABLE `balls` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `balls`
--

INSERT INTO `balls` (`id`, `name`, `size`, `createdAt`, `updatedAt`) VALUES
(1, 'Red', 2, '2024-04-16 12:58:16', '2024-04-16 12:58:16'),
(2, 'Blue', 4, '2024-04-16 13:08:57', '2024-04-16 13:08:57');

-- --------------------------------------------------------

--
-- Table structure for table `buckets`
--

CREATE TABLE `buckets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `currentVolume` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buckets`
--

INSERT INTO `buckets` (`id`, `name`, `capacity`, `currentVolume`, `createdAt`, `updatedAt`) VALUES
(1, 'Bucket 1', 50, 10, '2024-04-16 12:58:03', '2024-04-16 13:09:03'),
(2, 'Bucket 2', 40, 0, '2024-04-16 13:02:06', '2024-04-16 13:08:57');

-- --------------------------------------------------------

--
-- Table structure for table `bucket_balls`
--

CREATE TABLE `bucket_balls` (
  `quantity` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `bucketId` int(11) NOT NULL,
  `ballId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bucket_balls`
--

INSERT INTO `bucket_balls` (`quantity`, `createdAt`, `updatedAt`, `bucketId`, `ballId`) VALUES
(1, '2024-04-16 13:09:03', '2024-04-16 13:09:03', 1, 1),
(2, '2024-04-16 13:09:03', '2024-04-16 13:09:03', 1, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `balls`
--
ALTER TABLE `balls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buckets`
--
ALTER TABLE `buckets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bucket_balls`
--
ALTER TABLE `bucket_balls`
  ADD PRIMARY KEY (`bucketId`,`ballId`),
  ADD KEY `ballId` (`ballId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `balls`
--
ALTER TABLE `balls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `buckets`
--
ALTER TABLE `buckets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bucket_balls`
--
ALTER TABLE `bucket_balls`
  ADD CONSTRAINT `bucket_balls_ibfk_1` FOREIGN KEY (`bucketId`) REFERENCES `buckets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bucket_balls_ibfk_2` FOREIGN KEY (`ballId`) REFERENCES `balls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
