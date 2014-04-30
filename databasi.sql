-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 30, 2014 at 06:19 PM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `vegg_db`
--
CREATE DATABASE IF NOT EXISTS `vegg_db` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `vegg_db`;

-- --------------------------------------------------------

--
-- Table structure for table `akk_feed`
--

CREATE TABLE IF NOT EXISTS `akk_feed` (
  `akk_feed_id` int(11) NOT NULL AUTO_INCREMENT,
  `akk_innihald` text NOT NULL,
  `akk_akkordir` text NOT NULL,
  `akk_timestamp` int(11) NOT NULL,
  PRIMARY KEY (`akk_feed_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `akk_feed`
--

INSERT INTO `akk_feed` (`akk_feed_id`, `akk_innihald`, `akk_akkordir`, `akk_timestamp`) VALUES
(1, '', '', 1396194595);

-- --------------------------------------------------------

--
-- Table structure for table `feed`
--

CREATE TABLE IF NOT EXISTS `feed` (
  `feed_id` int(11) NOT NULL AUTO_INCREMENT,
  `feed_innihald` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `feed_type` varchar(20) NOT NULL,
  `feed_timestamp` int(100) NOT NULL,
  PRIMARY KEY (`feed_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `feed`
--

INSERT INTO `feed` (`feed_id`, `feed_innihald`, `feed_timestamp`) VALUES
(1, '', 1396194595);

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE IF NOT EXISTS `games` (
  `games_id` int(11) NOT NULL,
  `games_title` varchar(100) NOT NULL,
  `games_content` text NOT NULL,
  PRIMARY KEY (`games_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sangir`
--

CREATE TABLE IF NOT EXISTS `sangir` (
  `sang_id` int(8) NOT NULL AUTO_INCREMENT,
  `sang_tittul` varchar(100) NOT NULL,
  `sang_innihald` text NOT NULL,
  `sang_akkordir` text NOT NULL,
  PRIMARY KEY (`sang_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



CREATE USER 'vegg'@'localhost' IDENTIFIED BY '1234';GRANT ALL PRIVILEGES ON *.* TO 'vegg'@'localhost' IDENTIFIED BY '1234' WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;