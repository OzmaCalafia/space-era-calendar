export class SpaceEraDate {
  // Epoch: February 20, 1947 CE (UTC-anchored)
  static EPOCH = new Date(Date.UTC(1947, 1, 20)); // Note: month 1 is February

  constructor(ceYear, ceMonth, ceDay) {
    this.ceDate = new Date(Date.UTC(ceYear, ceMonth - 1, ceDay));
    this.ceYear = ceYear;
    this.ceMonth = ceMonth;
    this.ceDay = ceDay;
  }

  static fromIso(dateString) {
    const cleanStr = dateString.trim();
    const [year, month, day] = cleanStr.split('-').map(Number);
    return new SpaceEraDate(year, month, day);
  }

  _determineEra(integerYear) {
    if (integerYear > 0) return "SE";
    if (integerYear === 0) return "Year 0";
    return "BSE";
  }

  _getPhase1Data() {
    const month = this.ceDate.getUTCMonth() + 1;
    const day = this.ceDate.getUTCDate();
    const year = this.ceDate.getUTCFullYear();

    let seInteger;
    let epochStart;

    if (month > 2 || (month === 2 && day >= 20)) {
      seInteger = year - 1946;
      epochStart = new Date(Date.UTC(year, 1, 20));
    } else {
      seInteger = year - 1947;
      epochStart = new Date(Date.UTC(year - 1, 1, 20));
    }

    const diffTime = this.ceDate.getTime() - epochStart.getTime();
    const dayOfYear = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const era = this._determineEra(seInteger);
    const displayYear = Math.abs(seInteger);

    return [displayYear, era, dayOfYear];
  }

  _isPaxLeapYear(seYear) {
    if (seYear <= 0) return false;
    if (seYear % 100 === 0) {
      return seYear % 400 === 0;
    }
    return seYear % 6 === 0;
  }

  _getPhase2Data() {
    const diffTime = this.ceDate.getTime() - SpaceEraDate.EPOCH.getTime();
    const daysSinceEpoch = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (daysSinceEpoch < 0) {
      return this._getPhase1Data();
    }

    let currentSeYear = 1;
    let remainingDays = daysSinceEpoch;

    while (true) {
      const yearLength = this._isPaxLeapYear(currentSeYear) ? 371 : 364;

      if (remainingDays < yearLength) {
        const dayOfYear = remainingDays + 1;
        return [currentSeYear, "SE", dayOfYear];
      }

      remainingDays -= yearLength;
      currentSeYear += 1;
    }
  }

  toPhase1() {
    const [year, era, day] = this._getPhase1Data();
    if (era === "Year 0") return `Year 0, Day ${day} (Phase 1)`;
    return `Year ${year} ${era}, Day ${day} (Phase 1)`;
  }

  toPhase2() {
    const [year, era, day] = this._getPhase2Data();
    if (era === "Year 0") return `Year 0, Day ${day} (Phase 1)`; // fallback alignment
    return `Year ${year} ${era}, Day ${day} (Phase 2)`;
  }

  migrateToPhase2() {
    const [year, era, _] = this._getPhase1Data();
    const seYear = era === "SE" ? year : 0;
    const accumulatedDriftDays = Math.floor(seYear * 0.1428);
    return `Year ${seYear} SE, Compensated Phase 2 (Drift Offset: +${accumulatedDriftDays}d)`;
  }

  toDualString() {
    const [year, era, _] = this._getPhase1Data();
    const isoString = this.ceDate.toISOString().split('T')[0];

    if (era === "Year 0") return `0000 SE / ${isoString} CE`;

    const sign = era === "SE" ? "" : "-";
    const paddedYear = `${sign}${String(year).padStart(4, '0')}`;

    return `${paddedYear} ${era} / ${isoString} CE`;
  }
}
