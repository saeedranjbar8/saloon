CREATE TABLE venues (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 city text NOT NULL DEFAULT 'بافق',
 address text NOT NULL,
 is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE bookable_units (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 venue_id uuid NOT NULL REFERENCES venues(id),
 name text NOT NULL,
 is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE sports (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE);
CREATE TABLE unit_sports (
 unit_id uuid NOT NULL REFERENCES bookable_units(id),
 sport_id uuid NOT NULL REFERENCES sports(id),
 CONSTRAINT unit_sports_pair_uq UNIQUE(unit_id,sport_id)
);
INSERT INTO venues(id,name,address) VALUES
 ('10000000-0000-4000-8000-000000000001','مجموعهٔ ورزشی ولایت','بلوار امام'),
 ('10000000-0000-4000-8000-000000000002','سالن شهدای کارگر','محلهٔ مرکزی'),
 ('10000000-0000-4000-8000-000000000003','زمین ورزشی کوثر','بلوار مهدیه');
INSERT INTO bookable_units(id,venue_id,name) VALUES
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','واحد اصلی ولایت'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','سالن اصلی شهدای کارگر'),
 ('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003','زمین اصلی کوثر');
INSERT INTO sports(id,name) VALUES
 ('00000000-0000-4000-8000-000000000001','فوتبال'),
 ('00000000-0000-4000-8000-000000000002','والیبال'),
 ('00000000-0000-4000-8000-000000000003','بسکتبال');
INSERT INTO unit_sports(unit_id,sport_id) SELECT u.id,s.id FROM bookable_units u CROSS JOIN sports s;
UPDATE slots SET bookable_unit_id='20000000-0000-4000-8000-000000000001';
ALTER TABLE slots ADD CONSTRAINT slots_unit_fk FOREIGN KEY(bookable_unit_id) REFERENCES bookable_units(id);
