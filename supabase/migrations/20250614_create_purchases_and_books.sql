-- purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    book_id uuid REFERENCES books(id) ON DELETE CASCADE,
    purchased_at timestamptz DEFAULT now(),
    UNIQUE (user_id, book_id)
);

-- books table
CREATE TABLE IF NOT EXISTS books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    author text NOT NULL,
    image text,
    file_url text NOT NULL,
    created_at timestamptz DEFAULT now()
);
