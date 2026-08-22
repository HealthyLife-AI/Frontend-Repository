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
  const { data } = await apiClient.post<{ data: WeightLog } | WeightLog>(
    "/weight-logs",
    payload,
  );
  return unwrap<WeightLog>(data);
}

export async function listWeightLogs(): Promise<WeightLog[]> {
  const { data } = await apiClient.get<{ data: WeightLog[] } | WeightLog[]>(
    "/weight-logs",
  );
  return unwrap<WeightLog[]>(data);
}

export async function updateWeightLog(
  id: number,
  payload: Partial<CreateWeightLogPayload>,
): Promise<WeightLog> {
  const { data } = await apiClient.put<{ data: WeightLog } | WeightLog>(
    `/weight-logs/${id}`,
    payload,
  );
  return unwrap<WeightLog>(data);
}
