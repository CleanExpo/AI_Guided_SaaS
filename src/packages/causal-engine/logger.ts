export type LogActionType = 'added' | 'edited' | 'deleted' | 'kept';

export interface CausalLogEntry {
  componentId: string;
  componentType: string;
  page: string;
  promptContext: string;
  action: LogActionType;
  timestamp: number;
}

/**
 * Write log entry to localStorage or Supabase.
 * Extend this for production use with remote DB.
 */
export class CausalLogger {
  private key = 'causal_logs';
  
  log(entry: CausalLogEntry): void {
    const logs = this.getLogs();
    logs.push(entry);
    localStorage.setItem(this.key, JSON.stringify(logs));
  }
  
  getLogs(): CausalLogEntry[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }
  
  clearLogs(): void {
    localStorage.removeItem(this.key);
  }
  
  /**
   * (Optional) Save to Supabase DB instead of localStorage
   * Requires `causal_logs` table in Supabase
   */
  async logToSupabase(entry: CausalLogEntry): Promise<void> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
      );
      
      await supabase.from('causal_logs').insert([entry]);
    } catch (error) {
      console.error('Failed to log to Supabase:', error);
    }
  }
}

export const logger = new CausalLogger();