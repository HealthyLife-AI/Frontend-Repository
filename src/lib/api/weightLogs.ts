import { apiClient } from "./client";

export type WeightLog = {
  id: number;
  weight_kg: number;
  recorded_date: string; // ISO date, e.g. "2026-08-20"
  [key: string]: unknown;
};

export type CreateWeightLogPayload = {
  weight_kg: number;
  recorded_date: string;
};

/**
 * NOTE: the "Create Weight Log" and "List Weight Logs" requests in the
 * team's Postman collection were left as unconfigured GET placeholders
 * (no body, no path). The calls below follow standard Laravel resource
 * conventions — POST /weight-logs to create, GET /weight-logs to list —
 * consistent with the confirmed "Update Weight Log" request
 * (PUT /weight-logs/{id}). Confirm the exact routes with the backend team
 * and adjust here if they differ; this is the only integration point in
 * Sprint 2 built on an assumption rather than a confirmed request.
 */

function unwrap<T>(data: { data: T } | T): T {
  return typeof data === "object" && data !== null && "data" in data
    ? (data as { data: T }).data
    : (data as T);
}

export async function createWeightLog(
  payload: CreateWeightLogPayload,
): Promise<WeightLog> {
  const { data } = await apiClient.post<any>("/weight-logs", payload);
  if (data && typeof data === "object" && "weight_log" in data) {
    return data.weight_log as WeightLog;
  }
  if (data && typeof data === "object" && "data" in data) {
    return data.data as WeightLog;
  }
  return data as WeightLog;
}

export async function listWeightLogs(): Promise<WeightLog[]> {
  const { data } = await apiClient.get<any>("/weight-logs");
  if (Array.isArray(data)) {
    return data as WeightLog[];
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.weight_logs)) {
      return data.weight_logs as WeightLog[];
    }
    if (Array.isArray(data.data)) {
      return data.data as WeightLog[];
    }
  }
  return [];
}

export async function updateWeightLog(
  id: number,
  payload: Partial<CreateWeightLogPayload>,
): Promise<WeightLog> {
  const { data } = await apiClient.put<any>(`/weight-logs/${id}`, payload);
  if (data && typeof data === "object" && "weight_log" in data) {
    return data.weight_log as WeightLog;
  }
  if (data && typeof data === "object" && "data" in data) {
    return data.data as WeightLog;
  }
  return data as WeightLog;
}
