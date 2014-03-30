-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 30, 2014 at 03:50 PM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

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
-- Table structure for table `sangir`
--

CREATE TABLE IF NOT EXISTS `sangir` (
  `sang_id` int(8) NOT NULL AUTO_INCREMENT,
  `sang_tittul` varchar(100) NOT NULL,
  `sang_innihald` text NOT NULL,
  `sang_akkordir` text NOT NULL,
  PRIMARY KEY (`sang_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

