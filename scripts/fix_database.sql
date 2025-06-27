-- Check and insert vendors
INSERT INTO vendors (vendor_id, name, status, created_at, updated_at)
VALUES 
  ('vendor_a', 'Vendor A', 'active', NOW(), NOW()),
  ('vendor_b', 'Vendor B', 'active', NOW(), NOW()),
  ('vendor_c', 'Vendor C', 'active', NOW(), NOW())
ON CONFLICT (vendor_id) DO NOTHING;

-- Display vendors
SELECT * FROM vendors;