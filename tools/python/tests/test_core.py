from space_era.core import SpaceEraDate

def test_v2_epoch_launch():
    # Appendix A: V-2 Epoch Launch (February 20, 1947 CE)
    date = SpaceEraDate(1947, 2, 20)
    assert "Year 1 SE, Day 1 (Phase 1)" == date.to_phase_1()
    assert "Year 1 SE, Day 1 (Phase 2)" == date.to_phase_2()

def test_sputnik_launch():
    # Appendix A: Sputnik 1 Launch (October 4, 1957 CE)
    date = SpaceEraDate(1957, 10, 4)
    assert "Year 11 SE, Day 227 (Phase 1)" == date.to_phase_1()

def test_apollo_landing():
    # Appendix A: Apollo 11 Moon Landing (July 20, 1969 CE)
    date = SpaceEraDate(1969, 7, 20)
    assert "Year 23 SE, Day 151 (Phase 1)" == date.to_phase_1()

def test_publication_date():
    # Appendix A: Publication Date (August 20, 2026 CE)
    date = SpaceEraDate(2026, 8, 20)
    assert "Year 80 SE, Day 182 (Phase 1)" == date.to_phase_1()

def test_iso_ingestion():
    # Verify ISO 8601 string parsing safety
    date = SpaceEraDate.from_iso("2026-08-20")
    assert "Year 80 SE, Day 182 (Phase 1)" == date.to_phase_1()

def test_year_zero_boundary():
    # Year 0: February 20, 1946 CE
    date = SpaceEraDate(1946, 2, 20)
    assert "Year 0" in date.to_phase_1()
    
def test_before_space_era():
    # 1 BSE: February 20, 1945 CE
    date = SpaceEraDate(1945, 2, 20)
    assert "1 BSE" in date.to_phase_1()

def test_phase_1_leap_day():
    # Year 82 SE intersects with 2028 CE (Gregorian leap year)
    # February 29, 2028 is Day 10 of Year 82 SE
    date = SpaceEraDate(2028, 2, 29)
    assert "Year 82 SE, Day 10 (Phase 1)" == date.to_phase_1()

def test_pax_leap_week_variance():
    # Phase 2 Day 371 of Year 84 SE accounts for accumulated temporal drift
    date = SpaceEraDate(2031, 2, 12)
    assert "Year 84 SE, Day 358 (Phase 1)" == date.to_phase_1()
    assert "Year 84 SE, Day 371 (Phase 2)" == date.to_phase_2()

def test_center_day_alignment():
    # August 20, 2026 CE is Day 182 in Phase 1, and evaluates with drift offset in Phase 2
    date = SpaceEraDate(2026, 8, 20)
    assert "Day 182" in date.to_phase_1()
    assert "Day 190" in date.to_phase_2()

def test_dual_dating_output():
    # Article 6.1 & 6.2: Extended Technical Notation requires 4-digit zero-padded years
    date = SpaceEraDate(2026, 8, 20)
    assert date.to_dual_string() == "0080 SE / 2026-08-20 CE"
