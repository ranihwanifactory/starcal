export interface StarObject {
  id: string;
  name: string; // e.g., "오리온자리"
  type: 'Constellation' | 'Nebula' | 'Cluster';
  description: string; // Short summary
  imagePlaceholder: string; // URL for picsum
}

export interface MonthData {
  month: number;
  monthName: string;
  season: string;
  objects: StarObject[];
}

export interface AIDetailResponse {
  story: string; // Mythology or history
  bestViewingTime: string; // Specific advice
  findingTip: string; // How to locate it
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interestingFacts: string[];
}
