import { GoogleGenerativeAI } from "@google/generative-ai";
// Kita tidak perlu import Part atau OutputMode dari library yang lama.
// Kita definisikan OutputMode sederhana di sini jika belum ada di file lain.
// Jika OutputMode sudah didefinisikan di file types.ts, baris ini bisa dihapus.
export enum OutputMode {
  VisualPrompt = 'Visual Prompt (Midjourney/Imagen)',
  VideoScript = 'Video Script (Reels/TikTok)',
  ContentPlanner = 'Content Planner (7 Days)'
}

// 1. INI CARA AMBIL KUNCI YANG BENAR
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("MATI KUTU: VITE_API_KEY belum diisi di Vercel!");
}

// 2. INISIALISASI RESMI (Kita panggil dia 'genAI')
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function untuk memproses file gambar
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

// 3. FUNGSI UTAMA (Nama fungsi disamakan dengan kodingan lama Anda)
export async function generateContentFromImages(
  brandDnaFile: File,
  moodboardFile: File,
  objective: string,
  mode: OutputMode
): Promise<string> {

  // Pilih model Gemini yang stabil dan bisa melihat gambar
  // Kita pakai 'gemini-1.5-flash' yang cepat dan murah.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Siapkan gambar
  const brandDnaPart = await fileToGenerativePart(brandDnaFile);
  const moodboardPart = await fileToGenerativePart(moodboardFile);

  // Siapkan instruksi prompt (Saya sederhanakan sedikit agar lebih robust)
  const visualPromptFormatInstruction = `
    FORMAT OUTPUT KHUSUS UNTUK MODE 'Visual Prompt (Midjourney/Imagen)':
    - **Konsep (Bahasa Indonesia):** Jelaskan strategi visualnya. Gunakan Tone of Voice dari Gambar A.
    - **Prompt (Bahasa Inggris):** Berikan prompt teknis siap pakai untuk AI Image Generator.
   `;
  const defaultFormatInstruction = `
    FORMAT OUTPUT:
    Buat output format Markdown rapi, 100% Bahasa Indonesia, meniru gaya bahasa Gambar A.
   `;

  const promptText = `
    PERAN: Master Art Forger & Direktur Kreatif Forensik. Tiru gaya visual dan verbal Gambar A secara obsesif.
    INPUT:
    - IMAGE 1 (REFERENCE 'THE DNA'): Sumber kebenaran gaya dan tone of voice.
    - IMAGE 2 (MOODBOARD 'THE SUBJECT'): Referensi objek baru.
    - CONTEXT: "${objective}"
    TUGAS:
    Buat output mode '${mode}'. Ambil SUBJEK dari IMAGE 2, render ulang dengan 100% gaya visual & verbal IMAGE 1.
    ATURAN:
    1. MIMIKRI VISUAL: Tiru tekstur, lighting, dan ketidaksempurnaan Gambar A. Jangan jadi generik AI.
    2. MIMIKRI VERBAL: Tiru gaya bahasa Gambar A (formal/gaul/kasar) di semua output teks.
    ${mode === OutputMode.VisualPrompt ? visualPromptFormatInstruction : defaultFormatInstruction}
  `;

  try {
    console.log("Mengirim ke Google Gemini...");
    // Kirim prompt teks dan kedua gambar
    const result = await model.generateContent([
        promptText,
        brandDnaPart,
        moodboardPart
    ]);

    console.log("Jawaban diterima!");
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("JIAH ERROR SAAT NGOBROL SAMA GEMINI:", error);
    throw new Error("Gagal mendapatkan jawaban dari Gemini API. Cek konsol untuk detail.");
  }
}
