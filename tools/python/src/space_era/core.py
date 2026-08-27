import datetime

class SpaceEraDate:
    """
    Reference implementation of the Space Era (SE) Calendar Standard (v1.0).
    Epoch: February 20, 1947 CE.
    Universal Translator Architecture.
    """
    
    EPOCH = datetime.date(1947, 2, 20)
    
    def __init__(self, ce_year: int, ce_month: int, ce_day: int):
        self.ce_date = datetime.date(ce_year, ce_month, ce_day)
        
    @classmethod
    def from_iso(cls, date_string: str) -> "SpaceEraDate":
        """
        Safely creates a SpaceEraDate from an ISO 'YYYY-MM-DD' string.
        Eliminates month/day ambiguity at the point of ingestion.
        """
        parsed = datetime.date.fromisoformat(date_string.strip())
        return cls(parsed.year, parsed.month, parsed.day)

    def _determine_era(self, integer_year: int) -> str:
        if integer_year > 0:
            return "SE"
        elif integer_year == 0:
            return "Year 0"
        else:
            return "BSE"
            
    def _get_phase_1_data(self):
        """
        Calculates the Phase 1 calendar state (Common Era Synchronization).
        """
        if (self.ce_date.month > 2) or (self.ce_date.month == 2 and self.ce_date.day >= 20):
            se_integer = self.ce_date.year - 1946
            epoch_start = datetime.date(self.ce_date.year, 2, 20)
        else:
            se_integer = self.ce_date.year - 1947
            epoch_start = datetime.date(self.ce_date.year - 1, 2, 20)
            
        day_of_year = (self.ce_date - epoch_start).days + 1
        era = self._determine_era(se_integer)
        display_year = abs(se_integer)
        
        return display_year, era, day_of_year

    def _is_pax_leap_year(self, se_year: int) -> bool:
        """
        Article 3.2: The Pax Intercalation Algorithm.
        Evaluates mathematically if an SE year receives a 7-day Leap Week.
        Follows the modified modulo-6 cycle with centennial exclusions.
        """
        if se_year <= 0:
            return False
        if se_year % 100 == 0:
            return (se_year % 400 == 0)
        return (se_year % 6 == 0)

    def _get_phase_2_data(self):
        """
        Calculates the Phase 2 calendar state (Pax Leap Week Architecture).
        Anchors strictly to the physical day count elapsed since the Epoch.
        """
        days_since_epoch = (self.ce_date - self.EPOCH).days
        
        if days_since_epoch < 0:
            return self._get_phase_1_data()
            
        current_se_year = 1
        remaining_days = days_since_epoch
        
        while True:
            year_length = 371 if self._is_pax_leap_year(current_se_year) else 364
            
            if remaining_days < year_length:
                day_of_year = remaining_days + 1
                return current_se_year, "SE", day_of_year
                
            remaining_days -= year_length
            current_se_year += 1

    def to_phase_1(self) -> str:
        """Outputs the Phase 1 (Compatible Mode) string."""
        year, era, day = self._get_phase_1_data()
        if era == "Year 0":
            return f"Year 0, Day {day} (Phase 1)"
        return f"Year {year} {era}, Day {day} (Phase 1)"

    def to_phase_2(self) -> str:
        """Outputs the Phase 2 (Space Era Standard) string."""
        year, era, day = self._get_phase_2_data()
        if era == "Year 0":
            return f"Year 0, Day {day} (Phase 2)"
        return f"Year {year} {era}, Day {day} (Phase 2)"

    def migrate_to_phase_2(self) -> str:
        """
        Executes the Drift Compensation Protocol (Article 3.4.2).
        Calculates accumulated temporal drift between Phase 1 and Phase 2.
        """
        year, era, _ = self._get_phase_1_data()
        se_year = year if era == "SE" else 0
        accumulated_drift_days = int(se_year * 0.1428)
        return f"Year {se_year} SE, Compensated Phase 2 (Drift Offset: +{accumulated_drift_days}d)"

    def to_dual_string(self) -> str:
        """
        Outputs the Extended Technical Notation (Article 6.1).
        Uses Phase 1 for transitional compatibility.
        """
        year, era, _ = self._get_phase_1_data()
        ce_string = self.ce_date.isoformat()
        
        if era == "Year 0":
            return f"0000 SE / {ce_string} CE"
            
        sign = "" if era == "SE" else "-"
        padded_year = f"{sign}{year:04d}"
        
        return f"{padded_year} {era} / {ce_string} CE"
