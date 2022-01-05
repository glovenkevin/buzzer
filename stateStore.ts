/* abstract */
class StateStore {
    saveState(State:string) {}
    clear() {}
    getAllState() {}
  }
  
  export class InMemoryStateStore extends StateStore {
    States: string;
    constructor() {
      super();
      this.States = "";
    }
  
    saveState(State:string) {
      this.States = State;
    }

    clear() {
      this.States = "";
    }
    
    getAllState() {
        return this.States;
    }
  }
  