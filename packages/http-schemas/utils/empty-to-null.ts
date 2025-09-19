// Função compatível com z.preprocess (recebe unknown)
export const emptyToNull = (v: unknown) =>
    typeof v === "string" && v.trim() === "" ? null : v;
