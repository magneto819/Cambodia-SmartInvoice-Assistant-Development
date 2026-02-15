/*
  # Add Business Profile Fields

  1. Changes
    - Add signature_url field to profiles table for storing signature images
    - Signature will be used on invoices as per Cambodia requirements
  
  2. Notes
    - Signature can be uploaded and stored as a URL
    - All existing profiles will have null signature_url by default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'signature_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN signature_url text;
  END IF;
END $$;
