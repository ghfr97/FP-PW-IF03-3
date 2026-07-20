DROP DATABASE IF EXISTS `snowwash_db`;
CREATE DATABASE `snowwash_db`;
USE `snowwash_db`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `snowwash_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` int NOT NULL,
  `status` enum('MENUNGGU_PICKUP','DIJEMPUT','DICUCI','DISETRIKA','DIANTAR','SELESAI','BATAL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MENUNGGU_PICKUP',
  `order_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `notes` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `user_id`, `total_amount`, `status`, `order_date`, `notes`) VALUES
('ORD-3CC35BA3', 'a3abacae-a4e6-4c21-933a-d7b4b0553162', 6000, 'MENUNGGU_PICKUP', '2026-06-07 10:05:21.102', 'tolong jangan di campur');

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_id` int NOT NULL,
  `qty_or_weight` decimal(8,2) NOT NULL,
  `subtotal_price` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `order_id`, `service_id`, `qty_or_weight`, `subtotal_price`) VALUES
('44068568-f5b8-483e-8313-26d8b8b10b36', 'ORD-3CC35BA3', 1, 1.00, 6000);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `payment_method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_proof_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','VERIFIED','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `payment_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` int NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `description`, `price`, `unit`, `image_url`, `status`, `created_at`) VALUES
(1, 'Cuci Pakaian', 'Detergen premium, front-load', 6000, '/kg', NULL, 'ACTIVE', '2026-06-04 13:34:02.788'),
(2, 'Setrika Pakaian', 'Setrika uap, rapi sempurna', 4000, '/kg', NULL, 'ACTIVE', '2026-06-04 13:34:02.795'),
(3, 'Cuci + Setrika', 'Paket lengkap hemat', 9000, '/kg', NULL, 'ACTIVE', '2026-06-04 13:34:02.802'),
(4, 'Express Laundry', 'Prioritas antrian, 3 jam', 15000, '/kg', NULL, 'ACTIVE', '2026-06-04 13:34:02.810'),
(5, 'Cuci Pakaian', 'Detergen premium, front-load', 6000, '/kg', NULL, 'ACTIVE', '2026-06-07 07:52:33.354'),
(6, 'Setrika Pakaian', 'Setrika uap, rapi sempurna', 4000, '/kg', NULL, 'ACTIVE', '2026-06-07 07:52:33.362'),
(7, 'Cuci + Setrika', 'Paket lengkap hemat', 9000, '/kg', NULL, 'ACTIVE', '2026-06-07 07:52:33.369'),
(8, 'Express Laundry', 'Prioritas antrian, 3 jam', 15000, '/kg', NULL, 'ACTIVE', '2026-06-07 07:52:33.375');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `role` enum('ADMIN','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `refresh_token`, `created_at`) VALUES
('8cbaca5c-9362-4059-aba8-894e69623776', 'Budi Santoso', 'budi@example.com', '$2b$10$JyknQLeQB.TmH1A1mrrSzeA0A355eZ5N6Etu6yn1i30luH4Z6e7Gy', '081234567890', NULL, 'CUSTOMER', NULL, '2026-06-07 07:16:44.423'),
('a3abacae-a4e6-4c21-933a-d7b4b0553162', 'sasa ahsan', 'ahsan@students.amikom.ac.id', '$2b$10$KgPDzvpPrA3Kv1uRy/EXBuYmZbj0sDHVN/lbBYIrZkjegMoZH0ynW', '342423432432', NULL, 'CUSTOMER', NULL, '2026-06-07 09:54:47.339'),
('dfe6711e-f28e-4d11-b75c-d3b4a01007aa', 'Super Admin', 'admin@snowwash.com', '$2b$10$AiCld/S1NMXOd6DXSwwOF.UgOCMHQuTVHEGzyGYi9Y15Kmpgwkoya', '081234567890', 'Pusat Operasional Snowwash', 'ADMIN', NULL, '2026-06-04 13:34:02.778');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('22af3fae-8b39-4739-8839-4d559f5d410a', '35e4eb605802f836c6cf9b704baf1eb959f9eb062e2f3ca7abddcb1d588c5622', '2026-06-04 13:34:02.397', '20260604133401_init', NULL, NULL, '2026-06-04 13:34:01.749', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_user_id_fkey` (`user_id`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_order_id_fkey` (`order_id`),
  ADD KEY `OrderItem_service_id_fkey` (`service_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payment_order_id_fkey` (`order_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
