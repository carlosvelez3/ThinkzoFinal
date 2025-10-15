export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          project_type: string
          message: string
          status: 'new' | 'contacted' | 'completed' | 'spam'
          created_at: string
          updated_at: string
          ip_address: string | null
          user_agent: string | null
          project_goals: string | null
          target_audience: string | null
          selected_features: Json
          timeline_preference: string | null
          budget_range: string | null
          additional_notes: string | null
          template_used: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          project_type: string
          message: string
          status?: 'new' | 'contacted' | 'completed' | 'spam'
          created_at?: string
          updated_at?: string
          ip_address?: string | null
          user_agent?: string | null
          project_goals?: string | null
          target_audience?: string | null
          selected_features?: Json
          timeline_preference?: string | null
          budget_range?: string | null
          additional_notes?: string | null
          template_used?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          project_type?: string
          message?: string
          status?: 'new' | 'contacted' | 'completed' | 'spam'
          created_at?: string
          updated_at?: string
          ip_address?: string | null
          user_agent?: string | null
          project_goals?: string | null
          target_audience?: string | null
          selected_features?: Json
          timeline_preference?: string | null
          budget_range?: string | null
          additional_notes?: string | null
          template_used?: string | null
        }
        Relationships: []
      }
      captcha_verification_logs: {
        Row: {
          id: string
          token: string
          score: number | null
          action: string | null
          success: boolean
          error_message: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          score?: number | null
          action?: string | null
          success: boolean
          error_message?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          score?: number | null
          action?: string | null
          success?: boolean
          error_message?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface ProjectDetails {
  projectGoals: string;
  targetAudience: string;
  selectedFeatures: string[];
  timeline: string;
  budgetRange: string;
  additionalNotes: string;
  templateUsed?: string;
}

export interface ContactFormSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  message?: string;
  projectDetails?: ProjectDetails;
}

export interface ContactSubmissionRow extends Database['public']['Tables']['contact_submissions']['Row'] {}
export interface ContactSubmissionInsert extends Database['public']['Tables']['contact_submissions']['Insert'] {}
export interface ContactSubmissionUpdate extends Database['public']['Tables']['contact_submissions']['Update'] {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EdgeFunctionResponse<T = any> extends ApiResponse<T> {
  submissionId?: string;
}
