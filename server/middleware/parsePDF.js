import pdfParse from 'pdf-parse';

export async function extractPDFText(buffer) {
  const data = await pdfParse(buffer);
  const text = data.text ?? '';

  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const avgLen =
    lines.length > 0
      ? lines.reduce((s, l) => s + l.length, 0) / lines.length
      : 0;

  let warning = null;
  if (avgLen < 25 && lines.length > 10) {
    warning =
      'PDF may have multi-column layout. Results may be imperfect. Consider pasting as text.';
  }

  if (text.trim().length < 100) {
    throw new Error(
      'PDF appears to be empty or image-based. Please paste your resume as text.'
    );
  }

  return { text: text.trim(), warning };
}
