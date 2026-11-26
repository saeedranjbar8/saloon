CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TYPE booking_status AS ENUM ('pending_payment','confirmed','expired','cancelled','used','no_show');
CREATE TYPE payment_status AS ENUM ('unpaid','paid','refund_pending','refunded','failed');
CREATE TABLE slots (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 bookable_unit_id uuid NOT NULL,
 starts_at timestamptz NOT NULL,
 ends_at timestamptz NOT NULL,
 CONSTRAINT slots_valid_time CHECK (ends_at > starts_at),
 CONSTRAINT slots_unit_no_overlap EXCLUDE USING gist (bookable_unit_id WITH =, tstzrange(starts_at,ends_at,'[)') WITH &&)
);
CREATE INDEX slots_unit_start_idx ON slots(bookable_unit_id,starts_at);
CREATE TABLE bookings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slot_id uuid NOT NULL REFERENCES slots(id),
 athlete_id uuid,
 source text NOT NULL DEFAULT 'online' CHECK (source IN ('online','manual')),
 sport_id uuid NOT NULL,
 status booking_status NOT NULL DEFAULT 'pending_payment',
 payment_status payment_status NOT NULL DEFAULT 'unpaid',
 tariff_amount_rial integer NOT NULL CHECK (tariff_amount_rial >= 0),
 amount_rial integer NOT NULL CHECK (amount_rial >= 0),
 hold_expires_at timestamptz,
 idempotency_key text NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX bookings_one_active_per_slot_uq ON bookings(slot_id) WHERE status IN ('pending_payment','confirmed');
CREATE INDEX bookings_athlete_idx ON bookings(athlete_id,created_at);
