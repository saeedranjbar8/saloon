CREATE TYPE user_role AS ENUM ('athlete','facility_manager','sports_administration');
CREATE TABLE users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 phone text NOT NULL UNIQUE,
 display_name text NOT NULL,
 role user_role NOT NULL,
 password_hash text,
 is_active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_hash text NOT NULL UNIQUE,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_idx ON sessions(user_id);
