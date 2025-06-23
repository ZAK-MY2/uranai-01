// Database types for Supabase integration

export interface Database {
  public: {
    Tables: {
      environment_logs: {
        Row: {
          id: string
          created_at: string
          data: any
        }
        Insert: {
          id?: string
          created_at?: string
          data: any
        }
        Update: {
          id?: string
          created_at?: string
          data?: any
        }
      }
      divination_sessions: {
        Row: {
          id: string
          user_id: string
          session_data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_data: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_data?: any
          created_at?: string
        }
      }
    }
  }
}

export type EnvironmentData = {
  timestamp: string
  location: {
    latitude: number
    longitude: number
    timezone?: string
  }
  weather: {
    condition: string
    temperature: number
    humidity: number
    pressure: number
  }
  lunar: {
    phase: number
    illumination: number
    phaseName: string
  }
  solar: {
    sunrise: string
    sunset: string
    daylight: number
  }
  planetary: {
    mercury: number
    venus: number
    mars: number
    jupiter: number
    saturn: number
  }
}