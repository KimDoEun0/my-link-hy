// 업로드한 이미지를 256×256 JPEG로 줄여 data URL로 변환 (Firestore 문서 크기 제한 대비)
export async function resizeImage(file: File, size = 256): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("이미지를 처리할 수 없어요.");
  const scale = Math.max(size / bitmap.width, size / bitmap.height); // 가운데 기준으로 꽉 채워 자르기
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}
