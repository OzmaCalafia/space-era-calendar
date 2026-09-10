# Space Era Calendar: Spreadsheet Functions

This documentation provides the foundational spreadsheet infrastructure outlined by Appendix B of the Space Era Calendar Standard. 

Spreadsheets remain an essential medium for institutional, administrative, and scientific data management. This project supplies a zero-dependency, platform-independent toolset allowing researchers and organizations to batch-convert legacy Common Era (CE) dates into the Space Era standard natively. By utilizing universally supported logical formulas, this tool eliminates the need for proprietary software, custom macros, or active network connections, ensuring the calendar standard is immediately actionable in any offline or enterprise data environment.

**Note on Calendar Phases:** These formulas execute Phase 1 (Compatible Mode) conversions. Because standard spreadsheet software relies on hardcoded CE leap day mechanics, these functions natively output Phase 1 ordinal days within 365-day or 366-day structures. Phase 2 applications require software-level mapping of those ordinal values to permanent 364-day or 371-day structures.

## Application Compatibility

Compatible spreadsheet software processes these logical formulas natively. Supported applications include LibreOffice Calc and Google Sheets. Microsoft Excel restricts date calculations prior to Year 47 BSE, Day 317 (January 1, 1900 CE), requiring alternative software or the SE Python and CLI tools for dates prior to Year 47 BSE, Day 317 (January 1, 1900 CE).

## Usage Instructions

These formulas reference a Common Era Date and Time (UTC) located in cell **A2**. 
Copy and paste the corresponding formula into your target cell. 

### 1. Calculate the Space Era Year
The SE epoch boundary occurs annually on February 20. This formula calculates the CE year offset and accounts for the pre/post-boundary shift.

`=YEAR(A2) - 1946 - IF(MONTH(A2)<2, 1, IF(AND(MONTH(A2)=2, DAY(A2)<20), 1, 0))`

*Output Format: General Number (e.g., 80)*

### 2. Calculate the Space Era Day of the Year
This formula dynamically calculates the number of elapsed days since the most recent February 20 epoch boundary. The integer wrapper ensures time data is stripped prior to calculation.

`=INT(A2) - DATE(YEAR(A2) - IF(MONTH(A2)<2, 1, IF(AND(MONTH(A2)=2, DAY(A2)<20), 1, 0)), 2, 20) + 1`

*Output Format: General Number or Integer (e.g., 1 to 366)*

### 3. Calculate Decimal Time
Standard spreadsheet software stores time as a fractional decimal of a 24-hour day (where 12:00 PM = 0.5000). The Space Era decimal time vector is extracted by stripping the whole day integer, leaving only the remainder.

`=MOD(A2, 1)`

*Output Format: Number, configured to display 4 decimal places (e.g., 0.5000)*

### 4. Consolidated Timestamp String
This comprehensive formula dynamically evaluates the integer year to apply the correct era designation (SE, BSE, or Year 0). It combines the year, ordinal day, and decimal time into a single, fully formatted Phase 1 timestamp string.

`=IF((YEAR(A2)-1946-IF(MONTH(A2)<2,1,IF(AND(MONTH(A2)=2,DAY(A2)<20),1,0)))>0, (YEAR(A2)-1946-IF(MONTH(A2)<2,1,IF(AND(MONTH(A2)=2,DAY(A2)<20),1,0))) & " SE", IF((YEAR(A2)-1946-IF(MONTH(A2)<2,1,IF(AND(MONTH(A2)=2,DAY(A2)<20),1,0)))=0, "Year 0", ABS(YEAR(A2)-1946-IF(MONTH(A2)<2,1,IF(AND(MONTH(A2)=2,DAY(A2)<20),1,0))) & " BSE")) & " / " & TEXT(INT(A2 - DATE(YEAR(A2) - IF(MONTH(A2)<2, 1, IF(AND(MONTH(A2)=2, DAY(A2)<20), 1, 0)), 2, 20) + 1), "000") & " / " & TEXT(MOD(A2, 1), "0.0000")`
