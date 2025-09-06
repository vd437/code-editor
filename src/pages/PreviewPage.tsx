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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-editor-toolbar border-b border-editor-border flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Code Preview</h1>
        </div>
        
        <Button 
          variant="editor" 
          size="sm"
          onClick={refreshPreview}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </header>

      {/* Full-screen Preview */}
      <div className="flex-1 bg-preview-background">
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