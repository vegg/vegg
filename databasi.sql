-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 08, 2013 at 08:27 PM
-- Server version: 5.5.20
-- PHP Version: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `rachmaninoff`
--
CREATE DATABASE `rachmaninoff` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `rachmaninoff`;

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
(1, '{"1":"1. Lívsæla vissa: Jesus er mín!<br>Hann er mín vinur, kallar meg sín;<br>lívsæla vissa: Fullgjørt alt her!<br>Likam og sál, alt hansara er.","3":"2. Alt mátti fara – men alt eg vann,<br>æviga sólin fyri mær rann;<br>opið Guds ríki stendur, og mær<br>boðar hans orð um sæluna har."}', '{"1":{"18":{"1":2,"2":0},"3":{"1":1},"12":{"1":5,"2":5},"8":{"1":5},"27":{"1":0}},"3":{"4":{"1":2,"2":5},"15":{"1":2,"2":5},"18":{"1":2,"2":5}}}', 1365452554);

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
(1, 'Niðurlag:<br>Hann er mín gleði, songur mín hann,<br>meðan mín tunga røra seg kann;<br>ævigt hjá Gudi lova eg skal<br>honum, tí sál mín frelst varð og sæl.', 1365452554);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=38 ;

--
-- Dumping data for table `sangir`
--

INSERT INTO `sangir` (`sang_id`, `sang_tittul`, `sang_innihald`, `sang_akkordir`) VALUES
(21, 'Light of the world', 'Light of the world, You step down into<br>darkness. Opened my eyes let me see.<br>Beauty that made this heart adore you<br>hope of a life spent with you((vers))And here I am to worship,<br>Here I am to bow down,<br>Here I am to say that you''re my God,<br>You''re altogether lovely,<br>Altogether worthy,<br>Altogether wonderful to me.<br>((vers))I''ll never know how much it cost to see my sin upon that cross.<br>And I''ll never know how much it cost to see my sin upon that cross.<br>No I''ll never know how much it cost to see my sin upon that cross.((vers))King of all days,<br>Oh so highly exalted Glorious in heaven above. Humbly you came to the earth you created. All for love''s sake became poor.<br>', '{"1":{"1":{"1":7},"4":{"1":2,"2":6},"6":{"1":9,"2":2},"7":{"1":0},"11":{"1":7},"13":{"1":2,"2":6},"15":{"1":0}},"2":{"6":{"1":7},"12":{"1":2},"19":{"1":7},"23":{"1":0}}}'),
(23, 'Ãh, hvÃ¸r er hasin maÃ°ur, iÃ° krossin bera mÃ¡', '1. Ãh, hvÃ¸r er hasin maÃ°ur, iÃ° krossin bera mÃ¡?<br>Vanvirdur, niÃ°urboygdur, mÃ¡ lÃ­Ã°a spott og hÃ¡Ã°!<br>JÃº, hatta er Guds sonur, viÃ° tornum krÃ½ndur fer<br>viÃ° sigri inn Ã­ deyÃ°an og mÃ­nar syndir ber.<br>((vers))2. Ja, fyri mÃ­nar misgerÃ°ir soraÃ°ur tÃº varÃ° og fyri mÃ­ni lÃ³gbrot ta hvÃ¸ssu krÃºnu bar.TÃ­n mÃ¡ttur upp nÃº tornar, tÃ­n tunga loÃ°ar fÃ¸st,sum vaks tÃ­tt hjarta brÃ¡Ã°nar â€“ tÃº pÃ­nur mÃ­nar tÃ³kst.<br>((vers))3. TÃº, Leyvan, rÃ³tskot DÃ¡vids, tÃº hevÃ°i allan mÃ¡tt,<br>sum lamb tÃº bart taÃ° stillur og toldi hÃ¡Ã° og spott.<br>TÃº kÃ¦rleiksfulli maÃ°ur til krossin negldur varÃ°,<br>ja, mÃ­na straff tÃº toldi og mÃ­nar sjÃºkur bar.', ''),
(24, 'LÃ­vsÃ¦la vissa', '1. LÃ­vsÃ¦la vissa: Jesus er mÃ­n!<br>Hann er mÃ­n vinur, kallar meg sÃ­n;<br>lÃ­vsÃ¦la vissa: FullgjÃ¸rt alt her!<br>Likam og sÃ¡l, alt hansara er.((vers))NiÃ°urlag:<br>Hann er mÃ­n gleÃ°i, songur mÃ­n hann,<br>meÃ°an mÃ­n tunga rÃ¸ra seg kann;<br>Ã¦vigt hjÃ¡ Gudi lova eg skal<br>honum, tÃ­ sÃ¡l mÃ­n frelst varÃ° og sÃ¦l.((vers))2. Alt mÃ¡tti fara â€“ men alt eg vann,<br>Ã¦viga sÃ³lin fyri mÃ¦r rann;<br>opiÃ° Guds rÃ­ki stendur, og mÃ¦r<br>boÃ°ar hans orÃ° um sÃ¦luna har.((vers))3. SÃ¡l mÃ­n kann hvÃ­la, stillaÃ° og glaÃ°,<br>etur hin mat, ei menn hava sÃ¦Ã°;<br>Jesus meg frelsti, skuld mÃ­na galt,<br>eg eri einki, hann er mÃ¦r alt.', '{"1":{"18":{"1":2,"2":0},"3":{"1":1},"12":{"1":5,"2":5},"8":{"1":5},"27":{"1":0}},"3":{"4":{"1":2,"2":5},"15":{"1":2,"2":5},"18":{"1":2,"2":5}}}'),
(26, 'Halleluja syngur Ã­ mÃ­num hjarta', '1. â€žHallelujaâ€œ syngur Ã­ mÃ­num hjarta,<br>meg Jesus frelsti, sÃ¡l mÃ­n er frÃ­,<br>burtur er nÃº myrkriÃ°, tÃ­ sÃ³lin bjarta<br>birti â€žljÃ³s Ã¡ kvÃ¸ldartÃ­Ã°â€œ!<br>((vers))NiÃ°urlag:<br>Halleluja, eg elski Jesus,<br>taÃ° er so lÃ­vsÃ¦lt at kenna hann,<br>Ã¡h, kom til Jesus, hann vil teg frelsa,<br>ein fullan friÃ° einans hann tÃ¦r geva kann.<br>((vers))2. VerÃ°in roynir sÃ¡lir til sÃ­n at draga,<br>men aldri gav hon hjartanum friÃ°,<br>einans Jesus fult Ãºt kann sÃ¡lir gleÃ°a,<br>Ã­ lÃ­vi og Ã­ Ã¦vir viÃ°.((vers))3. Undurfult og stÃ³rt er Guds barn at vera,<br>hann gevur kraft til sigur hvÃ¸nn dag,<br>hvÃ¸rja byrÃ°i bÃ½Ã°ur hann sÃ¦r at bera,<br>syng, mÃ­n sÃ¡l, Ã­ gleÃ°ilag.<br>((vers))4. Syng, Ã¡h, syng tÃº frelsti um hesa gleÃ°i,<br>sum tÃº ein dag Ã¡ Golgata fann,<br>latiÃ° lovsong brÃºsa Ã¡ himmalvegi,<br>prÃ­s til hann, sum sigur vann!', ''),
(27, 'Sum fuglur iÃ° ferÃ°ast um himmal og hav', '1. Sum fuglur, iÃ° ferÃ°ast um himmal og hav, ein longsul vit fingu Ã­ ogn.<br>FrÃ¡ sÃ³l stÃ­g'' Ãºr havi til sÃ³l fer Ã­ kav,<br>vit sigla Ã­ Ã³dn og Ã­ logn.((vers))2. Vit sigla Ã­ eystan, har sÃ³l stÃ­gur upp, vestan, har aftur hon fer,<br>viÃ° trolara eins og viÃ° lÃ­tlari slupp,<br>vit sigla, har fiskurin er.<br>((vers))3. Ein mynd okkum fylgir, um leiÃ°in gerst long, gav landinum, fÃ³lkinum har,<br>av fjÃ¸llum, av lÃ­Ã°um, av grÃ¸nkandi ong,<br>av tÃ­, bert ein sjÃ³maÃ°ur sÃ¦r.<br>((vers))4. Og hevur tÃº onkran, iÃ° beyÃ° tÃ¦r farvÃ¦l, sum kysti og tÃ³k teg Ã­ favn,<br>sum eftir tÃ¦r leingist og fevna teg skal,<br>tÃ¡ aftur tÃº kemur Ã­ havn.<br>((vers))5. TÃº fyri mÃ¦r stendur Ã¡ degi sum nÃ¡tt,<br>og gÃ³Ã°a, tÃº ert mÃ¦r so kÃ¦r,<br>eg streingirnar rÃ¸ri, mÃ­tt eyga er vÃ¡tt,<br>o, var eg bert heima hjÃ¡ tÃ¦r.<br>((vers))6. Hvar kÃ³sin enn gongur, tey minnini mongei kÃ¡mast og hvÃ¸rva frÃ¡ mÃ¦r.<br>Eg elski teg, gÃ³Ã°a, og syngi mÃ­n song,<br>so leingi mÃ­tt hjarta taÃ° slÃ¦r.<br>((vers))7. NÃº tagnar mÃ­n guitar, eg glÃ­Ã°i nÃº inn<br>Ã­ svÃ¸vnin og droymi um teg,<br>tÃº eigur mÃ­n kÃ¦rleika, troystar mÃ­tt sinn,<br>tÃ­n kÃ¦rleiki uggar nÃº meg.', ''),
(28, 'TÃ­Ã°in rennur sum streymur Ã­ Ã¡', '1. TÃ­Ã°in rennur sum streymur Ã­ Ã¡,<br>tÃ­tt munnu bylgjurnar falla;<br>lÃ­tlum bÃ¡ti rekist eg Ã¡,<br>Ã¡raleysur at kalla.<br>((vers))2. HvÃ¸r ein lÃ¸ta og hvÃ¸r ein stund<br>at stÃ³ra fossinum dregur;<br>treingist mÃ­tt hjarta, tyngist mÃ­n lund,<br>hvar er Ãºr neyÃ°ini vegur?<br>((vers))3. HvÃ¸r hevur vinur vilja og mÃ¡tt<br>at bjarga mÃ¦r til landa?<br>Allir teir eru Ã¡ lÃ­kan hÃ¡tt<br>staddir sum eg Ã­ vanda.<br>((vers))4. Ein hevur vinurin vilja og mÃ¡tt<br>at bjarga mÃ¦r frÃ¡ grandi;<br>Jesus kann fÃ¸ra mÃ­n lÃ­tla bÃ¡t<br>trygt at himnasandi.<br>((vers))5. TÃ­Ã°in rennur sum streymur Ã­ Ã¡<br>fram Ã­ Harrans navni!<br>LÃ­tlum bÃ¡ti eri eg Ã¡, -<br>himnastrond fyri stavni.', ''),
(29, 'Jesus er besti vinur barnanna', 'Jesus er besti vinur barnanna<br>AltÃ­Ã° er hann hjÃ¡ mÃ¦r<br>aldrin fer hann frÃ¡ mÃ¦r<br>Jesus er besti vinur barnanna', ''),
(30, 'Gud er mÃ­n styrki og borg', 'Gud er mÃ­n styrki og borg<br>Gud er mÃ­n styrki og borg<br>MÃ­tt hjarta lÃ­tur Ã¡ teg<br>tÃº hjÃ¡lpir mÃ¦r<br>((vers))TÃ­ er taÃ° mÃ­tt hjarta fegnast, ja!<br>tÃ­ er taÃ° mÃ­tt hjarta fegnast<br>viÃ° sangi mÃ­num, vil eg prÃ­sa tÃ¦r Gud!', '{"1":{"1":{"1":2,"2":0},"8":{"1":5},"16":{"1":2,"2":0},"23":{"1":9}},"2":{"2":{"1":7,"2":0},"6":{"1":0},"10":{"1":5},"14":{"1":9},"18":{"1":7,"2":0},"19":{"1":9},"23":{"1":2,"2":0},"17":{"1":2,"2":0}}}'),
(32, 'Dukka mÃ­n er blÃ¡', 'Dukka mÃ­n er blÃ¡<br>Hestur mÃ­n er svartur<br>Ketta mÃ­n er grÃ¡<br>MÃ¡ni mÃ­n er bjartur<br>gyllir hvÃ¸rja Ã¡<br>((vers))Og ein summardag<br>fara vit at ferÃ°ast<br>langa leiÃ° avstaÃ°<br>tÃ¡ skal dukkan berast<br>tÃ¡ er systir glaÃ°<br>', ''),
(33, 'TÃº alfagra land mÃ­tt', '1. TÃº alfagra land mÃ­tt, mÃ­n dÃ½rasta ogn!<br>Ã¡ vetri so randhvÃ­tt, Ã¡ sumri viÃ° logn,<br>tÃº tekur meg at tÃ¦r so tÃ¦tt Ã­ tÃ­n favn.<br>Tit oyggjar so mÃ¦tar, GuÃ° signi taÃ° navn,<br>sum menn tykkum gÃ³vu, tÃ¡ teir tykkum sÃ³u.<br>Ja, GuÃ° signi FÃ¸royar, mÃ­tt land!<br>((vers))2. Hin roÃ°in, sum skÃ­nur Ã¡ sumri Ã­ lÃ­Ã°,<br>hin Ã³dnin, sum tÃ½nir mangt lÃ­v vetrartÃ­Ã°,<br>og myrkriÃ°, sum fjalir mÃ¦r bjartasta mÃ¡l,<br>og ljÃ³siÃ°, sum spÃ¦lir mÃ¦r sigur Ã­ sÃ¡l:<br>alt streingir, iÃ° tÃ³na, sum vÃ¡ga og vÃ³na,<br>at eg verji FÃ¸royar, mÃ­tt land.<br>((vers))3. Eg nÃ­gi tÃ­ niÃ°ur Ã­ bÃ¸n til tÃ­n, GuÃ°:<br>Hin heilagi friÃ°ur mÃ¦r falli Ã­ lut!<br>Lat sÃ¡l mÃ­na tvÃ¡a sÃ¦r Ã­ tÃ­ni dÃ½rd!<br>So torir hon vÃ¡ga - av Gudi vÃ¦l skÃ­rd -<br>at bera taÃ° merkiÃ°, sum eyÃ°kennir verkiÃ°,<br>iÃ° varÃ°veitir FÃ¸royar, mÃ­tt land!', ''),
(34, 'Jesus er besti vinur barnanna', 'Jesus er besti vinur barnanna<br>Jesus er besti vinur barnanna<br>AltÃ­Ã° er Hann hjÃ¡ mÃ¦r<br>Aldrin fer Hann frÃ¡ mÃ¦r<br>Jesus er besti vinur barnanna', ''),
(35, 'Zions land mÃ­tt stavnhald er', '966. Zions land mÃ­tt stavnhald er,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu.<br>FriÃ°ur fylgir mÃ¦r Ã¡ ferÃ°,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu.<br>((vers))NiÃ°urlag: GlaÃ°ur, glaÃ°ur,<br>syngjandi hvÃ¸nn dag<br>ferÃ°ist eg avstaÃ°.<br>GlaÃ°ur, glaÃ°ur,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu.<br>((vers))2. Ãlit er mÃ­tt sigursprÃ³gv,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu.<br>Sigli mangan vandasjÃ³gv,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu.<br>((vers))3. SkjÃ³tt eg hÃ³mi heimlandsstrond,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu,<br>syngi Ã¦vigan fagnaÃ°arsong,<br>glaÃ°ur Ã­ Guds stÃ³ru frelsu.', ''),
(36, 'Above All', 'Above all powers, above all kings<br>Above all nature and all created things<br>Above all wisdom and all the ways of man<br>You were here before the world began((vers))Above all kingdoms above all thrones<br>Above all wonders the world has ever known<br>Above all wealth and treasures of the earth<br>There''s no way to measure what You''re worth((vers))Crucified laid behind a stone<br>You lived to die rejected and alone<br>Like a rose trampled on the ground<br>You took the fall and thought of me<br>Above all', ''),
(37, 'BlÃ³Ã°iÃ° sum rann', '1. BlÃ³Ã°iÃ°, sum rann, pÃ­nan, sum tÃº bar.<br>Av monnum svikin varÃ°,<br>tÃ­n Gud fÃ³r frÃ¡ tÃ¦r har.<br>SegÃ°ist undan tÃ­ni trÃ³nu,<br>Sonur Guds viÃ° tornakrÃ³nu<br>hevur goldiÃ° alla heimsins skuld.((vers))NiÃ°urlag: Gud, tÃ­n nÃ¡Ã°i er stÃ¸rri,<br>enn orÃ° kundu tÃ½tt,<br>Gud, tÃ­n nÃ¡Ã°i, hon vÃ­sir mÃ¦r virÃ°i mÃ­tt,<br>ein Ã³fatandi prÃ­s eg kostaÃ°i tÃ¦r.<br>Gud, tÃ­n nÃ¡Ã°i er lÃ­v hjÃ¡ mÃ¦r.((vers))2. TÃº gavst upp alt at frelsa meg,<br>tÃ­n stÃ³ri kÃ¦rleiki,<br>hann toldi deyÃ°ans veg,<br>vildi krossins verk Ãºtinna,<br>lÃ­vsins krÃºnu mÃ¦r at vinna<br>â€“ nÃ¡Ã°i tÃ­n er mÃ¦r so dÃ½rabar.', '{"1":{"2":{"1":5},"4":{"1":10},"5":{"1":0},"8":{"1":5},"12":{"1":10},"16":{"1":0},"20":{"1":5},"23":{"1":10},"25":{"1":0},"27":{"1":5},"30":{"1":2,"2":0},"36":{"1":0,"2":6},"32":{"1":10}},"2":{"4":{"1":5},"6":{"1":10},"9":{"1":7},"11":{"1":0},"15":{"1":5},"17":{"1":10},"19":{"1":7},"20":{"1":0},"23":{"1":5},"24":{"1":10},"26":{"1":5},"27":{"1":2,"2":0},"31":{"1":10},"33":{"1":0},"35":{"1":5}}}');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
