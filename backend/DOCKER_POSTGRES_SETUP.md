# PostgreSQL Docker Setup for ISO 8583 Analyzer

As requested, here is the setup guide to transition the backend from SQLite to a production-grade PostgreSQL instance running in Docker.

## 1. Start PostgreSQL with Docker

Run the following command to start a PostgreSQL 15 container. It will map port `5432` to your local machine.

```bash
docker run --name iso8583-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=securepassword123 \
  -e POSTGRES_DB=iso8583db \
  -p 5432:5432 \
  -d postgres:15
```

## 2. Update Backend Configuration

1. Open `backend/.env`
2. Comment out the SQLite URL and uncomment/update the PostgreSQL URL:

```env
# DATABASE_URL=sqlite:///./iso8583_analyzer.db
DATABASE_URL=postgresql://admin:securepassword123@localhost:5432/iso8583db
```

## 3. Install PostgreSQL Driver

Since you are running Python locally and connecting to the Docker database, you need the PostgreSQL Python driver (`psycopg2-binary`).

Make sure your virtual environment is activated, then run:

```bash
cd backend
.\venv\Scripts\Activate.ps1
pip install psycopg2-binary
```

> **Note for Windows**: If `psycopg2-binary` fails to install due to missing C++ build tools or `pg_config`, you can use `psycopg2` via the pure Python fallback `psycopg` (version 3):
> `pip install "psycopg[binary]"`
> and update your database URL prefix to: `postgresql+psycopg://...`

## 4. Re-run Seed Script

Your new PostgreSQL database is empty. You need to re-create the tables and seed the ISO 8583 rules.

```bash
python seed_rules.py
```

## 5. Restart the Backend

Stop the current running `uvicorn` server and start it again:

```bash
uvicorn app.main:app --reload --port 8000
```

Your FastAPI backend is now running on a production-ready PostgreSQL database!
