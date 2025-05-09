export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DatabaseTypes = {
  public: {
    Tables: {
      chart_view: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      connection: {
        Row: {
          encrypted_host: string
          encrypted_name: string
          encrypted_password: string
          encrypted_port: string
          encrypted_type: string
          encrypted_username: string
          id: number
          user_id: string
        }
        Insert: {
          encrypted_host: string
          encrypted_name: string
          encrypted_password: string
          encrypted_port: string
          encrypted_type: string
          encrypted_username: string
          id?: number
          user_id?: string
        }
        Update: {
          encrypted_host?: string
          encrypted_name?: string
          encrypted_password?: string
          encrypted_port?: string
          encrypted_type?: string
          encrypted_username?: string
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      dashboard: {
        Row: {
          created_at: string
          created_by: string | null
          folder_id: string | null
          id: string
          name: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          folder_id?: string | null
          id?: string
          name: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          folder_id?: string | null
          id?: string
          name?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dahsboard_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dahsboard_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_question: {
        Row: {
          dashboard_id: string
          position: number | null
          question_id: string
        }
        Insert: {
          dashboard_id?: string
          position?: number | null
          question_id?: string
        }
        Update: {
          dashboard_id?: string
          position?: number | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_question_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_question_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
        ]
      }
      folder: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folder_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          },
        ]
      }
      question: {
        Row: {
          created_at: string
          created_by: string
          id: string
          title: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string | null
          workspace_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          },
        ]
      }
      question_view: {
        Row: {
          question_id: string
          view_type_id: number
        }
        Insert: {
          question_id?: string
          view_type_id: number
        }
        Update: {
          question_id?: string
          view_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_view_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_view_view_type_id_fkey"
            columns: ["view_type_id"]
            isOneToOne: false
            referencedRelation: "chart_view"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace: {
        Row: {
          created_at: string
          id: string
          is_personal: boolean
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_personal: boolean
          name: string
          owner_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_personal?: boolean
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          role: string
          user_id?: string
          workspace_id?: string
        }
        Update: {
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_connections_minimal: {
        Args: { p_key: string }
        Returns: {
          id: number
          user_id: string
          type: string
          name: string
        }[]
      }
      insert_connection_encrypted: {
        Args: {
          p_host: string
          p_port: string
          p_type: string
          p_name: string
          p_username: string
          p_password: string
          p_key: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = DatabaseTypes[Extract<keyof DatabaseTypes, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseTypes },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseTypes
  }
    ? keyof (DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseTypes }
  ? (DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseTypes },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseTypes
  }
    ? keyof DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseTypes }
  ? DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseTypes },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseTypes
  }
    ? keyof DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseTypes }
  ? DatabaseTypes[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseTypes },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseTypes
  }
    ? keyof DatabaseTypes[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseTypes }
  ? DatabaseTypes[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseTypes },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseTypes
  }
    ? keyof DatabaseTypes[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseTypes }
  ? DatabaseTypes[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
