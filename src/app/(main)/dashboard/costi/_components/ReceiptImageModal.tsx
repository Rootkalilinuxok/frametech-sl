"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, X } from "lucide-react";

interface ReceiptImageModalProps {
  imageUrl: string;
  fileName: string;
  onClose: () => void;
}
export function ReceiptImageModal({ imageUrl, fileName, onClose }: ReceiptImageModalProps) {
  const [zoom, setZoom] = React.useState(1);

  const handleDownload = React.useCallback(() => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    link.click();
  }, [imageUrl, fileName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full bg-background rounded-lg p-4 overflow-hidden flex flex-col items-center">
        {/* Bottone Chiudi in alto a destra */}
        <Button
          variant="outline"
          className="absolute top-3 right-3 p-1 rounded-full"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
        {/* Container scrollabile immagine */}
        <div className="flex-1 flex items-center justify-center overflow-auto w-full mb-20">
          <img
            src={imageUrl}
            alt={fileName}
            style={{ maxWidth: "100%", maxHeight: "80vh", transform: `scale(${zoom})`, transition: "transform 0.2s" }}
            className="block"
          />
        </div>
        {/* Overlay pulsanti, sempre in basso */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/70 px-4 py-2 rounded-lg shadow-lg">
          <Button variant="secondary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
          <Button variant="secondary" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={() => setZoom(z => Math.max(z - 0.2, 0.2))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

