import { z } from "zod";

export function isValidIban(value: string) {
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(value)) return false;
  const rearranged = value.slice(4) + value.slice(0, 4);
  let remainder = 0;
  for (const character of rearranged) {
    const digits = /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

export const paymentSettingsSchema = z.object({
  payment_mode: z.enum(["rib", "link"]).default("rib"),
  payment_account_holder: z.string().trim().max(160).default(""),
  payment_iban: z.string().transform(value => value.replace(/\s/g, "").toUpperCase()).default(""),
  payment_bic: z.string().trim().toUpperCase().max(11).default(""),
  payment_url: z.string().trim().max(2000).default(""),
}).superRefine((value, context) => {
  const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });
  if (value.payment_iban && !isValidIban(value.payment_iban)) issue("payment_iban", "IBAN invalide.");
  if (value.payment_bic && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.payment_bic)) issue("payment_bic", "BIC invalide.");
  if (value.payment_url) {
    try { const url = new URL(value.payment_url); if (url.protocol !== "https:" || url.username || url.password) throw new Error(); }
    catch { issue("payment_url", "Le lien de paiement doit être une URL HTTPS valide."); }
  }
  if (value.payment_mode === "link" && !value.payment_url) issue("payment_url", "Renseignez le lien de paiement.");
  if (value.payment_mode === "rib" && (value.payment_iban || value.payment_bic || value.payment_account_holder) && (!value.payment_iban || !value.payment_bic || !value.payment_account_holder)) issue("payment_iban", "Renseignez le titulaire, l’IBAN et le BIC.");
});
export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;
