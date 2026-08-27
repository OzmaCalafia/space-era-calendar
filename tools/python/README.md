# Space Era Calendar Engine (Python)

The canonical Python reference implementation of the Space Era (SE) Calendar Standard (Version 1.0).

Designed as a lightweight, zero-dependency translation layer, this engine processes absolute physical time (POSIX-anchored) and renders it dynamically into legacy Common Era formats, Phase 1 (Compatible Mode), or Phase 2 (Space Era Standard).

## Features
* **Universal Translator Architecture:** Safely navigates the 20.5-year interim adoption period by separating physical time storage from formatting, preventing timeline fracturing.
* **ISO 8601 Ingestion:** Eliminates global month/day ambiguity via a dedicated `from_iso` constructor.
* **Dual-Dating Support:** Natively outputs the Extended Technical Notation (`YYYY-MM-DD SE / YYYY-MM-DD CE`) mandated by Article 6.1.
* **Pax Intercalation Engine:** Mathematically executes the modulo-6 Leap Week rules for Phase 2 absolute day processing.

## Installation
```bash
cd tools/python
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

## Usage
```python
from space_era.core import SpaceEraDate

# Initialize using mathematical integers (Year, Month, Day) or ISO 8601 strings
publication = SpaceEraDate.from_iso("2026-08-20")

# Phase 1: Compatible Mode (Common Era Sync)
print(publication.to_phase_1())
# Output: Year 80 SE, Day 182 (Phase 1)

# Phase 2: Space Era Standard (Permanent Architecture)
print(publication.to_phase_2())
# Output: Year 80 SE, Day 182 (Phase 2)

# Extended Technical Notation (Dual-Dating)
print(publication.to_dual_string())
# Output: 0080 SE / 2026-08-20 CE
```

## Testing
Run the mathematical proving ground to verify historical milestones (Appendix A):
```bash
pip install -e .[test]
python3 -m pytest tests/test_core.py
```

## License and Attribution
Licensed under **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
Author: Ozma Calafia.

This Standard belongs to humanity's collective temporal heritage and is intended to remain freely accessible to all persons and institutions in perpetuity.
