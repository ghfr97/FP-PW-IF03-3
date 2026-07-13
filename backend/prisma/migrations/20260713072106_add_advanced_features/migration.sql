-- 1. VIEW (Minggu 13)
-- Membuat View untuk melihat ringkasan pesanan per pelanggan
CREATE OR REPLACE VIEW UserOrderSummaryView AS
SELECT u.id as user_id, u.name, COUNT(o.id) as total_orders, SUM(o.total_amount) as total_spent
FROM User u
LEFT JOIN `Order` o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- 2. TRIGGER (Minggu 11)
-- Membuat Trigger untuk validasi agar total_amount tidak negatif sebelum di-insert
DROP TRIGGER IF EXISTS BeforeInsertOrder;
CREATE TRIGGER BeforeInsertOrder
BEFORE INSERT ON `Order`
FOR EACH ROW
BEGIN
    IF NEW.total_amount < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Total amount cannot be negative';
    END IF;
END;

-- 3. FUNCTION (Minggu 9)
-- Membuat fungsi untuk menghitung diskon 10% jika transaksi > 100.000
DROP FUNCTION IF EXISTS CalculateDiscount;
CREATE FUNCTION CalculateDiscount(amount INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE discount INT DEFAULT 0;
    IF amount > 100000 THEN
        SET discount = amount * 0.10;
    END IF;
    RETURN amount - discount;
END;

-- 4. STORED PROCEDURE, CURSOR, dan PROCEDURAL SQL (Minggu 6, 7, 10)
-- Procedure ini akan meloop semua order menggunakan Cursor, menghitung diskon, dan update tabel Order.
DROP PROCEDURE IF EXISTS ApplyDiscountToAllOrders;
CREATE PROCEDURE ApplyDiscountToAllOrders()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_order_id VARCHAR(191);
    DECLARE curr_amount INT;
    DECLARE new_amount INT;
    
    -- Cursor (Minggu 7)
    DECLARE order_cursor CURSOR FOR SELECT id, total_amount FROM `Order`;
    
    -- Handler untuk Cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN order_cursor;
    
    -- Procedural SQL: Looping (Minggu 6)
    read_loop: LOOP
        FETCH order_cursor INTO curr_order_id, curr_amount;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Memanggil Function CalculateDiscount
        SET new_amount = CalculateDiscount(curr_amount);
        
        -- Procedural SQL: IF statement (Minggu 6)
        IF new_amount != curr_amount THEN
            UPDATE `Order` SET total_amount = new_amount WHERE id = curr_order_id;
        END IF;
    END LOOP;
    
    CLOSE order_cursor;
END;

-- 5. DCL - DATABASE SECURITY (Minggu 14)
-- Membuat user kasir dan memberikan hak akses SELECT ke database
CREATE USER IF NOT EXISTS 'kasir_user'@'localhost' IDENTIFIED BY 'kasir123';
GRANT SELECT ON snowwash_db.* TO 'kasir_user'@'localhost';
FLUSH PRIVILEGES;