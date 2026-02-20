export interface Card {
  _id: string;
  name: string;
  set: string;
  card_number: string;
  image_url: string;
  is_graded: boolean;
  grading?: {
    company: string;
    grade: number;
    cert_number: string;
  };
  condition?: string; // For raw cards
  purchase_price?: number;
  estimated_value?: number;
  quantity: number;
  notes?: string;
  tags?: string[];
  created_at: string;
}

export interface Binder {
  _id: string;
  name: string;
  rows: number;
  columns: number;
  slots: (string | null)[][];
  created_at: string;
}

export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'SGC' | 'Other';

export type CardCondition = 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Fair' | 'Poor';

export type CardTag = 'For Trade' | 'For Sale' | 'PC' | 'Investment';
