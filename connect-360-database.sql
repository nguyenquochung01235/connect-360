-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 14, 2025 at 05:37 PM
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
-- Database: `connect-360-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` bigint(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` text DEFAULT NULL,
  `is_super_admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `username`, `password`, `token`, `is_super_admin`) VALUES
(1, 'admin', '$2b$10$aCp3gZBGHRcTyKC4XIytR.GX1jYUH23Ll4PqgsZut7xM1HLkEjbWu', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `id_device` bigint(11) NOT NULL,
  `device_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `channel` varchar(256) NOT NULL,
  `active` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`id_device`, `device_name`, `description`, `channel`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Home Temp', 'Home temp description mock data', 'esp8266/test', 0, '2025-04-09 04:29:21', '2025-04-13 13:41:11'),
(2, 'Kitten Temp', 'Kitten temp description', 'esp8267/test', 1, '2025-04-11 12:52:44', '2025-04-11 12:52:44'),
(3, 'test', 'test', 'esp82616/test', 1, '2025-04-12 09:11:27', '2025-04-12 09:11:27'),
(4, 'test', '', 'esp826/test', 0, '2025-04-12 09:11:51', '2025-04-12 09:11:51'),
(5, 'test', '', 'esp82616/test1', 1, '2025-04-12 09:12:19', '2025-04-12 09:12:19'),
(6, 'test', '', 'esp82616/test2', 1, '2025-04-12 09:12:22', '2025-04-12 09:12:22'),
(7, 'test', '', 'esp82616/test3', 1, '2025-04-12 09:12:24', '2025-04-12 09:12:24'),
(8, 'test', '', 'esp82616/test4', 1, '2025-04-12 09:12:26', '2025-04-12 09:12:26'),
(9, 'test', '', 'esp82616/test5', 1, '2025-04-12 09:12:29', '2025-04-12 09:12:29'),
(10, 'test', '', 'esp82616/test6', 1, '2025-04-12 09:12:31', '2025-04-12 09:12:31'),
(11, 'test', '', 'esp82616/test7', 1, '2025-04-12 09:12:33', '2025-04-12 09:12:33'),
(12, 'test', '', 'esp82616/test8', 1, '2025-04-12 09:12:35', '2025-04-12 09:12:35'),
(13, 'test', 'test', 'esp82616/test9', 1, '2025-04-12 09:12:38', '2025-04-12 09:46:05'),
(14, 'Test Device', 'Test real device get data', 'devices/703365/value', 1, '2025-04-13 10:17:10', '2025-04-13 10:17:10');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` bigint(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` text DEFAULT NULL,
  `active` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `token`, `active`, `created_at`, `updated_at`) VALUES
(1, 'user1', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-10 15:31:35', '2025-04-10 15:31:35'),
(22, 'user2', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:19:08', '2025-04-11 17:19:08'),
(23, 'user3', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(24, 'user4', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(25, 'user5', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(26, 'user6', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(27, 'user7', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(28, 'user8', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(29, 'user9', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(30, 'user10', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(31, 'user11', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(32, 'user12', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(33, 'user13', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(34, 'user14', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(35, 'user15', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(36, 'user16', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(37, 'user17', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(38, 'user18', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(39, 'user19', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(40, 'user20', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(41, 'user21', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(42, 'user22', '$2b$10$nebZCHkan0MPLp8db/IedOebGs2LHMapn659e1TDt/UTB2gvZKSoa', NULL, 1, '2025-04-11 17:20:34', '2025-04-11 17:20:34'),
(43, 'hungnq53', '$2b$10$kwtviEXE6g1NbdShZaCffulF15DJdef.qpmeHJRx0bDzms5TfOPrO', NULL, 1, '2025-04-12 06:43:37', '2025-04-13 10:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `user_device`
--

CREATE TABLE `user_device` (
  `id_user_device` bigint(11) NOT NULL,
  `id_user` bigint(11) NOT NULL,
  `id_device` bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_device`
--

INSERT INTO `user_device` (`id_user_device`, `id_user`, `id_device`) VALUES
(9, 43, 1),
(10, 43, 2),
(11, 43, 14);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`id_device`),
  ADD UNIQUE KEY `channel` (`channel`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_device`
--
ALTER TABLE `user_device`
  ADD PRIMARY KEY (`id_user_device`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_device` (`id_device`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `device`
--
ALTER TABLE `device`
  MODIFY `id_device` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `user_device`
--
ALTER TABLE `user_device`
  MODIFY `id_user_device` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_device`
--
ALTER TABLE `user_device`
  ADD CONSTRAINT `user_device_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_device_ibfk_2` FOREIGN KEY (`id_device`) REFERENCES `device` (`id_device`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
