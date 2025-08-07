export interface Database {
  public: {
    Tables: {
      calculations_history: {
        Row: {
          id: string;
          user_id: string;
          expression: string;
          result: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          expression: string;
          result: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          expression?: string;
          result?: string;
          created_at?: string;
        };
      };
    };
  };
}