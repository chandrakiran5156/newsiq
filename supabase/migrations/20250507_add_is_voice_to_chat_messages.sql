
-- Add is_voice column to chat_messages table
ALTER TABLE chat_messages ADD COLUMN is_voice BOOLEAN DEFAULT FALSE;

-- Update existing messages to have is_voice = false
UPDATE chat_messages SET is_voice = FALSE WHERE is_voice IS NULL;
