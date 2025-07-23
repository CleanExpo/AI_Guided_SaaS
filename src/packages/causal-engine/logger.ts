// packages/causal-engine/logger.ts
export type LogActionType = 'added' | 'edited' | 'deleted' | 'kept';export interface CausalLogEntry {
  componentId: string,
  componentType: string,
  page: string,
  promptContext: string,
  action: LogActionTyp
e,
    timestamp: number
}
/**
 * Write log entry to localStorage or Supabase.
 * Extend this for production use with remote DB.
 */
export class CausalLogger {
  private key = 'causal_logs';
  log(entry: CausalLogEntry) {
    const logs = this.getLogs();
    logs.push(entry);
    localStorage.setItem(this.key, JSON.stringify(logs))
}
  getLogs(): CausalLogEntry[] {
    const _raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : []
}
  clearLogs() {
    localStorage.removeItem(this.key)
}
  /**
   * (Optional) Save to Supabase DB instead of localStorage
   * Requires `causal_logs` table in Supabase``
   */
  async logToSupabase(entry: CausalLogEntry): Promise<any> {
    try {
      const { createClient   }: any = await import('@supabase/supabase-js');
      const supabase = createClient(;
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.from('causal_logs').insert([entry])
    } catch (error) {
      console.warn(
        '[🧠 Logger] Supabase logging failed, falling back to, localStorage:',
        // error
      );
      this.log(entry)
}}

export const logger = new CausalLogger();