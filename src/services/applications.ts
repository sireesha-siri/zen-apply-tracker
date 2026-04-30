import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Application = Tables<"applications">;
export type ApplicationInsert = TablesInsert<"applications">;
export type ApplicationUpdate = TablesUpdate<"applications">;

export const STATUSES = ["Applied", "Interview", "Offer", "Rejected"] as const;
export type Status = (typeof STATUSES)[number];

export async function getAllApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("date_applied", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createApplication(
  payload: Omit<ApplicationInsert, "user_id">
): Promise<Application> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("applications")
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApplication(
  id: string,
  patch: ApplicationUpdate
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
}
