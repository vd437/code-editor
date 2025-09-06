import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Code, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor = ({ className }: CodeEditorProps) => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Editor Preview</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        button:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Editor!</h1>
        <p>Edit the code to see live changes.</p>
        <button onclick="showAlert()">Click me!</button>
    </div>

    <script>
        function showAlert() {
            alert('Hello from your code editor! 🚀');
        }
    </script>
</body>
</html>`);

  const [activeLanguage, setActiveLanguage] = useState<"html" | "css" | "javascript">("html");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = htmlCode;
      toast.success("Code executed successfully!");
    }
  };

  useEffect(() => {
    // Auto-run code after initial load
    const timer = setTimeout(runCode, 500);
    return () => clearTimeout(timer);
  }, []);

  const editorOptions = {
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: "on" as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on" as const,
    folding: true,
    foldingStrategy: "auto" as const,
    showFoldingControls: "always" as const,
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showFunctions: true,
      showVariables: true
    }
  };

  return (
    <div className={cn("h-screen flex flex-col bg-editor-background", className)}>
      {/* Toolbar */}
      <div className="bg-editor-toolbar border-b border-editor-border flex items-center justify-between px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Code Editor</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="editor" size="sm" onClick={runCode}>
            <Play className="w-4 h-4 mr-2" />
            Run Code
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Editor Panel */}
        <div className={cn(
          "flex flex-col transition-all duration-300",
          isFullscreen ? "w-full h-full" : "w-full lg:w-1/2 h-1/2 lg:h-full"
        )}>
          {/* Language Tabs */}
          <div className="bg-editor-toolbar border-b border-editor-border flex overflow-x-auto">
            {(["html", "css", "javascript"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                  activeLanguage === lang
                    ? "text-primary border-primary bg-editor-background"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-editor-background/50"
                )}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={activeLanguage === "javascript" ? "javascript" : activeLanguage}
              value={htmlCode}
              onChange={(value) => setHtmlCode(value || "")}
              theme="vs-dark"
              options={editorOptions}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {!isFullscreen && (
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-t lg:border-t-0 lg:border-l border-editor-border flex flex-col">
            <div className="bg-editor-toolbar border-b border-editor-border px-4 py-2">
              <span className="text-sm font-medium text-foreground">Preview</span>
            </div>
            <div className="flex-1 bg-preview-background min-h-0">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};