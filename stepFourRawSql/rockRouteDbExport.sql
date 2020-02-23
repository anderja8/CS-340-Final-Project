-- Course: CS340
-- Date: 02/21/2020
-- Team: Team 7, Fighting Flamingos
-- Name: Jacob Anderson, John Rudoloph

-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: Feb 23, 2020 at 10:54 AM
-- Server version: 10.4.11-MariaDB-log
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_anderja8`
--

-- --------------------------------------------------------

--
-- Table structure for table `Areas`
--

CREATE TABLE `Areas` (
  `area_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `approach` varchar(10000) NOT NULL,
  `state_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Areas`
--

INSERT INTO `Areas` (`area_id`, `name`, `approach`, `state_id`) VALUES
(1, 'Yosemite - El Capitan', 'Inside Yosemite national park. From the El Capitan meadow, cross the road and find one of the obvious approach trails towards the wall.', 1),
(2, 'McDowell Mountains - Tom\'s Thumb', 'Follow the Tom\'s thumb Trailhead in Scottsdale until you reach Tom\'s Thumb, the obvious tower.', 2),
(3, 'Looking Glass - Nose Area', 'Take FS475 in Brevard to Headwaters Rd. Follow Headwaters Rd for about 2.5 miles to an obvious parking area. From this area, hike up the climber\'s trail about a half mile to the base of the wall.', 40);

-- --------------------------------------------------------

--
-- Table structure for table `Routes`
--

CREATE TABLE `Routes` (
  `route_id` int(11) NOT NULL,
  `route_title` varchar(255) NOT NULL,
  `overview` varchar(10000) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `approach` varchar(10000) NOT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `first_ascent` varchar(255) DEFAULT NULL,
  `first_ascent_date` date DEFAULT NULL,
  `pitch_count` int(11) NOT NULL DEFAULT 1,
  `area_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Routes`
--

INSERT INTO `Routes` (`route_id`, `route_title`, `overview`, `grade`, `type`, `approach`, `latitude`, `longitude`, `first_ascent`, `first_ascent_date`, `pitch_count`, `area_id`) VALUES
(1, 'The Nose', 'Perhaps the most iconic rock climbing route on the planet, the Nose in Yosemite scales the El Capitan wall.', '5.9 C2', 'Aid', 'Hike up and left around the foot of the El Cap wall until it is possible to traverse back right and you should end up on a nice dirt ledge and the start of the first pitch.', 37.7337, -119.635, 'Warren Harding, Wayne Merry, George Whitmore', '1958-01-01', 31, 1),
(2, 'Deep Freeze', 'The most challenging route to the top of Tom\'s Thumb, Deep Freeze takes you up a burly crack system with two 10+/11- cruxes.', '5.11-', 'Trad', 'The North Face of Tom\'s Thumb.', 33.681, -111.811, 'Stan Mish, Jim Waugh', '1978-01-01', 1, 2),
(3, 'Sundial Crack', 'Not as famous as The Nose route to its left, but still a classic Carolina eyebrow climb. The Sundial crack is named after a 20 foot splitter crack on pitch 3.', '5.8-', 'Trad', 'The trail to the Nose area puts you right at the base for this climb.', 35.305, -82.796, 'Bob Mitchell, Will Fulton', '1972-01-01', 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `States`
--

CREATE TABLE `States` (
  `state_id` int(11) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `States`
--

INSERT INTO `States` (`state_id`, `state`) VALUES
(1, 'California'),
(2, 'Arizona'),
(3, 'Alabama'),
(4, 'Alaska'),
(5, 'Arkansas'),
(6, 'Colorado'),
(7, 'Connecticut'),
(8, 'Delaware'),
(9, 'Florida'),
(10, 'Georgia'),
(11, 'Hawaii'),
(12, 'Idaho'),
(13, 'Illinois'),
(14, 'Indiana'),
(15, 'Iowa'),
(16, 'Kansas'),
(17, 'Kentucky'),
(18, 'Louisiana'),
(19, 'Maine'),
(20, 'Maryland'),
(21, 'Massachusetts'),
(22, 'Michigan'),
(23, 'Minnesota'),
(24, 'Mississippi'),
(25, 'Missouri'),
(26, 'Montana'),
(27, 'Nebraska'),
(28, 'Nevada'),
(29, 'New Hampshire'),
(30, 'New Jersey'),
(31, 'New Mexico'),
(32, 'New York'),
(33, 'North Carolina'),
(34, 'North Dakota'),
(35, 'Ohio'),
(36, 'Oklahoma'),
(37, 'Oregon'),
(38, 'Pennsylvania'),
(39, 'Rhode Island'),
(40, 'South Carolina'),
(41, 'South Dakota'),
(42, 'Tennessee'),
(43, 'Texas'),
(44, 'Utah'),
(45, 'Vermont'),
(46, 'Virginia'),
(47, 'Washington'),
(48, 'West Virginia'),
(49, 'Wisconsin'),
(50, 'Wyoming');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `state_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `first_name`, `last_name`, `username`, `password`, `state_id`) VALUES
(1, 'Jacob', 'Anderson', 'anderja8', 'notapassword', 2),
(2, 'Teacher\'s', 'Assistant', 'grader', 'password', NULL),
(3, 'John', 'Rudolph', 'rudolpjo', 'password', 44);

-- --------------------------------------------------------

--
-- Table structure for table `Users_Routes`
--

CREATE TABLE `Users_Routes` (
  `user_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users_Routes`
--

INSERT INTO `Users_Routes` (`user_id`, `route_id`, `rating`) VALUES
(1, 1, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Areas`
--
ALTER TABLE `Areas`
  ADD PRIMARY KEY (`area_id`),
  ADD UNIQUE KEY `UNIQUE_AREA` (`name`,`state_id`),
  ADD KEY `state_id` (`state_id`);

--
-- Indexes for table `Routes`
--
ALTER TABLE `Routes`
  ADD PRIMARY KEY (`route_id`),
  ADD UNIQUE KEY `UNIQUE_ROUTE` (`route_title`,`area_id`),
  ADD KEY `area_id` (`area_id`);

--
-- Indexes for table `States`
--
ALTER TABLE `States`
  ADD PRIMARY KEY (`state_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `UNIQUE_USERS` (`username`),
  ADD KEY `state_id` (`state_id`);

--
-- Indexes for table `Users_Routes`
--
ALTER TABLE `Users_Routes`
  ADD PRIMARY KEY (`user_id`,`route_id`),
  ADD KEY `route_id` (`route_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Areas`
--
ALTER TABLE `Areas`
  MODIFY `area_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Routes`
--
ALTER TABLE `Routes`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `States`
--
ALTER TABLE `States`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Areas`
--
ALTER TABLE `Areas`
  ADD CONSTRAINT `Areas_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `States` (`state_id`);

--
-- Constraints for table `Routes`
--
ALTER TABLE `Routes`
  ADD CONSTRAINT `Routes_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `Areas` (`area_id`);

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `States` (`state_id`);

--
-- Constraints for table `Users_Routes`
--
ALTER TABLE `Users_Routes`
  ADD CONSTRAINT `Users_Routes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Users_Routes_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `Routes` (`route_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
