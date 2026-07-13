import QRCode from "qrcode";

export async function generateQrSvg(
  url: string,
  size = 180,
): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: size,
    color: { dark: "#171717", light: "#ffffff" },
  });
}
