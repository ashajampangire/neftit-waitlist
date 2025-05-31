/*
  # Add wallet address column to waitlist entries

  1. Changes
    - Add `wallet_address` column to `waitlist_entries` table
      - Type: text
      - Nullable: true
      - Description: Stores the user's Ethereum wallet address

  2. Security
    - No changes to RLS policies needed
    - Existing table security remains unchanged
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_entries' 
    AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE waitlist_entries 
    ADD COLUMN wallet_address text;
  END IF;
END $$;