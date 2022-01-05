/* abstract */
 class LeaderboardStore {
    saveLeaderboard(leaderboard:string) {}
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
    
    getAllLeaderboard() {
        return this.leaderboards;
    }
  }
  