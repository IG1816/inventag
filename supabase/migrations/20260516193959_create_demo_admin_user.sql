/*
  # Create demo admin user

  Creates a demo admin account for testing and development purposes.
  Email: admin@rfidmanager.com
  Password: rfid@2024
*/

-- Insert demo user into auth.users with confirmed email
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@rfidmanager.com',
  crypt('rfid@2024', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Carlos Silva"}',
  false,
  'authenticated',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@rfidmanager.com'
);
