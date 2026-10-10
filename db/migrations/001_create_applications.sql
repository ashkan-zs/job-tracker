CREATE TABLE applications (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company VARCHAR(150) NOT NULL,
  position VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'applied',
  CONSTRAINT valid_status
    CHECK (status IN ('applied', 'interview', 'rejected', 'offer'))
);