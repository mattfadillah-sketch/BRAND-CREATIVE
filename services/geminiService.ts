
import { GoogleGenAI, Part } from "@google/genai";
import { OutputMode } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

// Function to convert a File object to a Part object
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function generateContentFromImages(
  brandDnaFile: File,
  moodboardFile: File,
  objective: string,
  mode: OutputMode
): Promise<string> {
  
  const brandDnaPart = await fileToGenerativePart(brandDnaFile);
  const moodboardPart = await fileToGenerativePart(moodboardFile);

  const visualPromptFormatInstruction = `
   FORMAT OUTPUT KHUSUS UNTUK MODE 'Visual Prompt (Midjourney/Imagen)':
   - **Konsep (Bahasa Indonesia):** Jelaskan strategi dan ide visual di baliknya. Gunakan Bahasa Indonesia yang 100% sesuai dengan Tone of Voice dari Gambar A.
   - **Prompt (Bahasa Inggris):** Berikan prompt teknis dalam Bahasa Inggris yang siap di-copy-paste untuk AI Image Generator (seperti Midjourney/DALL-E).
  `;

  const defaultFormatInstruction = `
   FORMAT OUTPUT:
   Buat output dalam format Markdown yang rapi dan 100% dalam Bahasa Indonesia, sepenuhnya meniru gaya bahasa dari Gambar A.
  `;

  const prompt = `
    PERAN:
    Anda adalah 'Master Art Forger' (Ahli Pemalsu Seni) dan Direktur Kreatif Forensik. Tugas Anda adalah meniru gaya visual dan verbal secara obsesif hingga ke detail terkecil.

    INPUT:
    - IMAGE 1 (REFERENCE 'THE DNA'): Ini adalah sumber kebenaran mutlak untuk gaya, tekstur, teknik rendering, dan Tone of Voice.
    - IMAGE 2 (MOODBOARD 'THE SUBJECT'): Ini hanya referensi untuk objek/subjek baru yang akan dibuat.
    - CONTEXT: "${objective}"

    PROSES BERPIKIR WAJIB (JANGAN LANGSUNG GENERATE):
    Sebelum membuat output, lakukan 'DEKONSTRUKSI FORENSIK' pada IMAGE 1 di dalam pikiran Anda:
    1.  **Analisis Visual (Gaya):**
        - **Medium & Teknik:** Apakah ini foto analog, ilustrasi digital vektor, lukisan cat minyak, atau kolase? Bagaimana goresan kuas atau garisnya (bersih/kasar)?
        - **Tekstur & Imperfeksi:** Apakah ada film grain, tekstur kertas, efek cetak sablon, atau noise digital tertentu?
        - **Pencahayaan & Warna:** Bagaimana *color grading*-nya? Apakah warnanya pudar (muted), neon, atau saturasi tinggi? Dari mana arah cahayanya?
        - **Komposisi Mikroskopis:** Detail kecil apa yang membuat gambar ini unik?
    2.  **Analisis Verbal (Suara):**
        - Jika ada teks di IMAGE 1, analisis gaya bahasanya (formal, slang 'lo/gue', puitis, rebel?). Ini adalah Tone of Voice yang wajib ditiru untuk semua teks naratif.

    TUGAS UTAMA:
    Buat output mode '${mode}' dengan mengambil SUBJEK dari IMAGE 2, tetapi MENDERENDERING-NYA ULANG menggunakan 100% teknik visual DAN verbal yang ditemukan di IMAGE 1.

    ATURAN KETAT:
    1.  **MIMIKRI VISUAL:** JANGAN gunakan gaya AI generik (smooth 3D, glossy) jika referensi bergaya kasar/2D. Jika IMAGE 1 adalah ilustrasi tangan yang tidak rapi, hasil output HARUS terlihat tidak rapi juga. Presisi gaya lebih penting daripada keindahan gambar.
    2.  **MIMIKRI VERBAL:** Jika IMAGE 1 menggunakan bahasa gaul/kasar, MAKA SEMUA TEKS OUTPUT (konsep, naskah) HARUS MENGGUNAKAN BAHASA ITU JUGA. Jangan jadi sopan atau formal.
    3.  **HINDARI KATA AI:** Jangan pernah menggunakan frasa generik seperti 'Tingkatkan gaya Anda', 'Solusi terbaik'.

    ${mode === OutputMode.VisualPrompt ? visualPromptFormatInstruction : defaultFormatInstruction}
  `;

  const contents = {
    parts: [
      { text: prompt },
      brandDnaPart, // Gambar A (Reference)
      moodboardPart, // Gambar B (Moodboard)
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents
    });

    if (response.text) {
        return response.text;
    } else {
        throw new Error("API returned no text in the response.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
}
