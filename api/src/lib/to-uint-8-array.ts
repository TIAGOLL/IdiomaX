export function toUint8Array(avatar: any): Uint8Array {
    if (avatar instanceof Uint8Array) return avatar;
    if (avatar instanceof ArrayBuffer) return new Uint8Array(avatar);
    if (Array.isArray(avatar)) return new Uint8Array(avatar);
    if (typeof avatar === "string") {
        try {
            const binary = Buffer.from(avatar, 'base64');
            return new Uint8Array(binary);
        } catch {
            return new Uint8Array();
        }
    }
    return new Uint8Array();
}