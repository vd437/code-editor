import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

export const PreviewPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the code from localStorage
    const savedCode = localStorage.getItem("editorCode");
    if (savedCode) {
      const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
      if (iframe) {
        iframe.srcdoc = savedCode;
      }
    }
  }, []);

  const refreshPreview = () => {
    const savedCode = localStorage.getItem("editorCode");
    if (savedCode) {
      const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
      if (iframe) {
        iframe.srcdoc = savedCode;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="bg-editor-toolbar border-b border-editor-border flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 shrink-0 min-h-[60px]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Editor</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">Code Preview</h1>
        </div>
        
        <Button 
          variant="editor" 
          size="sm"
          onClick={refreshPreview}
          className="text-xs sm:text-sm shrink-0"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Refresh</span>
          <span className="sm:hidden">↻</span>
        </Button>
      </header>

      {/* Full-screen Preview */}
      <div className="flex-1 bg-preview-background overflow-hidden">
        <iframe
          id="preview-iframe"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Code Preview"
        />
      </div>
    </div>
  );
};