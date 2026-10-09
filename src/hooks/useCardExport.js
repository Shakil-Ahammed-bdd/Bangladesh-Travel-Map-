import { useState } from 'react';
import { buildPdf, canvasToBlob, renderCardCanvas } from '../utils/exportCard';

/**
 * Turns the map card into a JPG / PNG / PDF file and hands it to `saveFile(blob, filename)`.
 *   const { exporting, exportError, exportCard } = useCardExport(saveFile);
 *   exportCard('png', { render: { ...what to draw... }, fileBase: 'my-map' });
 */
export function useCardExport(saveFile) {
  const [exporting, setExporting] = useState(''); // '' or the format being made right now
  const [exportError, setExportError] = useState(false);

  async function exportCard(format, { render, fileBase }) {
    if (exporting) return;
    setExporting(format);
    setExportError(false);
    try {
      const canvas = await renderCardCanvas(render);
      let blob;
      if (format === 'png') {
        blob = await canvasToBlob(canvas, 'image/png');
      } else {
        const jpg = await canvasToBlob(canvas, 'image/jpeg', 0.92);
        if (format === 'jpg') blob = jpg;
        else blob = buildPdf(new Uint8Array(await jpg.arrayBuffer()), canvas.width, canvas.height);
      }
      await saveFile(blob, `${fileBase}.${format}`);
    } catch (e) {
      if (!(e && e.code === 'declined')) setExportError(true);
    } finally {
      setExporting('');
    }
  }

  return { exporting, exportError, exportCard };
}
