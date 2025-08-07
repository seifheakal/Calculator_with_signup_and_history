/*
  # Create calculations history table

  1. New Tables
    - `calculations_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `expression` (text, the mathematical expression)
      - `result` (text, the calculation result)
      - `created_at` (timestamp, default now())

  2. Security
    - Enable RLS on `calculations_history` table
    - Add policy for authenticated users to read their own history
    - Add policy for authenticated users to insert their own history
*/

CREATE TABLE IF NOT EXISTS calculations_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expression text NOT NULL,
  result text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calculations_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own calculation history"
  ON calculations_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculation history"
  ON calculations_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_calculations_history_user_created 
  ON calculations_history(user_id, created_at DESC);