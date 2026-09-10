import { SpaceEraDate } from 'space-era-calendar';

class CalendarStore extends EventTarget {
  constructor() {
    super();
    this.state = {
      now: new Date(),
      activeTab: 'clock'
    };

    // Ticking loop for real-time update
    setInterval(() => {
      this.state.now = new Date();
      this.dispatchEvent(new CustomEvent('tick', { detail: this.state.now }));
    }, 1000);
  }

  getLiveConversion() {
    // Extract YYYY-MM-DD in UTC
    const isoString = this.state.now.toISOString().split('T')[0];
    
    // Instantiate your core math class
    const seDate = SpaceEraDate.fromIso(isoString);
    
    return {
      phase1: seDate.toPhase1(),
      phase2: seDate.toPhase2()
    };
  }

  convertCustomDate(ceString) {
    try {
      const seDate = SpaceEraDate.fromIso(ceString);
      return { 
        ok: true, 
        data: {
          phase1: seDate.toPhase1(),
          phase2: seDate.toPhase2()
        } 
      };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
}

export const store = new CalendarStore();
