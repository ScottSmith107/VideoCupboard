-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 12:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movieserver`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `userID` int(11) NOT NULL,
  `videoID` int(11) NOT NULL,
  `whenUploaded` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`userID`, `videoID`, `whenUploaded`) VALUES
(0, 207, '2025-03-19 01:10:32'),
(6, 180, '2025-03-19 01:10:32');

-- --------------------------------------------------------

--
-- Table structure for table `icons`
--

CREATE TABLE `icons` (
  `iconID` int(11) NOT NULL,
  `fullPath` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `icons`
--

INSERT INTO `icons` (`iconID`, `fullPath`) VALUES
(6, 'icons/pink.PNG'),
(7, 'icons/blue.PNG'),
(8, 'icons/green.PNG');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `icon` int(11) NOT NULL COMMENT 'iconID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `name`, `icon`) VALUES
(22, 'Amber', 6),
(23, 'Scott', 7),
(24, 'Scott0', 8);

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `Name` varchar(128) NOT NULL,
  `Description` varchar(32) NOT NULL,
  `dir` int(11) NOT NULL COMMENT 'the id of the folder where the item is stored',
  `Full_path` varchar(128) NOT NULL COMMENT 'full file path to the item\r\n',
  `folder` tinyint(1) NOT NULL,
  `icon` varchar(128) NOT NULL COMMENT 'contains file path to icon',
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`Name`, `Description`, `dir`, `Full_path`, `folder`, `icon`, `id`) VALUES
('Los Retros - Someone To Spend Time With.mp4', 'song', 0, 'Los Retros - Someone To Spend Time With.mp4', 0, 'videoIcon/jim_icon.jpg', 1),
('The.Notebook.2004.1080p.mp4', 'Its the notebook lol', 0, 'The.Notebook.2004.1080p.mp4', 0, 'videoIcon/notebook.JPEG', 180),
('pentagram songs', '', 0, 'pentagram songs', 1, 'videoIcon/pentagramIcon.png', 231),
('1 Buck Spin.mp3', '', 231, 'pentagram songs\\1 Buck Spin.mp3', 0, 'videoIcon/pentagramIcon.png', 232);

-- --------------------------------------------------------

--
-- Table structure for table `watching`
--

CREATE TABLE `watching` (
  `userID` int(11) NOT NULL,
  `videoID` int(11) NOT NULL,
  `time` int(11) NOT NULL COMMENT 'time to the nearest minute',
  `whenUploaded` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watching`
--

INSERT INTO `watching` (`userID`, `videoID`, `time`, `whenUploaded`) VALUES
(6, 180, 2677, '2025-03-20 06:13:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `icons`
--
ALTER TABLE `icons`
  ADD PRIMARY KEY (`iconID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `icons`
--
ALTER TABLE `icons`
  MODIFY `iconID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
