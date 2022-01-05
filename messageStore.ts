/* abstract */
 class LeaderboardStore {
    saveLeaderboard(leaderboard:string) {}
    clear() {}
    getAllLeaderboard() {}
  }
  
  export class InMemoryLeaderboardStore extends LeaderboardStore {
    leaderboards: string[];
    constructor() {
      super();
      this.leaderboards = [];
    }
  
    saveLeaderboard(leaderboard:string) {
      this.leaderboards.push(leaderboard);
    }

    clear() {
      this.leaderboards = [];
    }
    
    getAllLeaderboard() {
        return this.leaderboards;
    }
  }
  