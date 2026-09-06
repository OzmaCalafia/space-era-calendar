# Space Era Calendar REST API

A REST API backend for the Space Era Calendar Standard, providing endpoints for PWA integration and date calculations.

## Quick Start

1. Install dependencies:
   npm install

2. Start the server (development mode):
   npm run dev

3. Start the server (production mode):
   NODE_ENV=production npm start

## Endpoints

Base URL: http://localhost:3000

### Health Check
* GET /api/v1/health
* Response: {"status":"ok","system":"Space Era Calendar API","version":"1.0.0","uptime":17.5,"timestamp":"2026-09-06T04:04:23.463Z"}

### Today's Date Conversion
* GET /api/v1/today
* Response: {"queryDate":"2026-09-06","phase1":"Year 80 SE, Day 168 (Phase 1)","phase2":"Year 80 SE, Day 176 (Phase 2)"}

### Full Date Conversion (CE to Space Era)
* GET /api/v1/ce/:date (Format: YYYY-MM-DD)
* Example: /api/v1/ce/2026-09-05
* Response: {"ceDate":"2026-09-05","phase1":"Year 80 SE, Day 167 (Phase 1)","phase2":"Year 80 SE, Day 175 (Phase 2)"}

### Phase 1 Only
* GET /api/v1/phase1/:date (Format: YYYY-MM-DD)
* Example: /api/v1/phase1/2026-09-05

### Phase 2 Only
* GET /api/v1/phase2/:date (Format: YYYY-MM-DD)
* Example: /api/v1/phase2/2026-09-05
