FROM python:3.13.3-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ && \
    rm -rf /var/lib/apt/lists/*

COPY backend/ /app/backend/

RUN pip install -e /app/backend

RUN pip install -r /app/backend/requirements.txt

EXPOSE 8000

CMD ["uvicorn", "backend.interfaces.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
