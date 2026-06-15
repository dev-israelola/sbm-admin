import { api } from "@/lib/api";

export type UploadKind =
  | "PRODUCT_IMAGE"
  | "REFUND_EVIDENCE"
  | "PROOF_OF_DELIVERY"
  | "PAYMENT_PROOF"
  | "EXPENSE_RECEIPT"
  | "CONSULTATION_ATTACHMENT"
  | "OTHER";

export interface UploadedFile {
  id: string;
  kind: UploadKind;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(file: File, kind: UploadKind) {
  const fileBase64 = await fileToDataUrl(file);
  const { data } = await api.post<UploadedFile>("/uploads", {
    kind,
    fileBase64,
    mimeType: file.type,
    originalName: file.name,
  });
  return data;
}
