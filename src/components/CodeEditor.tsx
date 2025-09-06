import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Code, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor = ({ className }: CodeEditorProps) => {
  const navigate = useNavigate();
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body>
    <h1>Welcome to Code Editor!</h1>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}`);

  const [jsCode, setJsCode] = useState(`console.log('Welcome to JavaScript!');

function greet() {
    alert('Hello World!');
}

greet();`);

  const [activeLanguage, setActiveLanguage] = useState<"html" | "css" | "javascript">("html");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getCurrentCode = () => {
    switch (activeLanguage) {
      case "css": return cssCode;
      case "javascript": return jsCode;
      default: return htmlCode;
    }
  };

  const setCurrentCode = (value: string) => {
    switch (activeLanguage) {
      case "css": setCssCode(value); break;
      case "javascript": setJsCode(value); break;
      default: setHtmlCode(value); break;
    }
  };

  const runCode = () => {
    // Combine all code into a single HTML document
    const combinedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Preview</title>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/, '').replace(/<\/body>[\s\S]*?<\/html>/, '')}
    <script>
        ${jsCode}
    </script>
</body>
</html>`;

    // Save to localStorage and navigate to preview
    localStorage.setItem("editorCode", combinedCode);
    navigate("/preview");
    toast.success("Code executed! Opening preview...");
  };

  useEffect(() => {
    // Load saved code from localStorage
    const savedHtml = localStorage.getItem("editorHtml");
    const savedCss = localStorage.getItem("editorCss");
    const savedJs = localStorage.getItem("editorJs");
    
    if (savedHtml) setHtmlCode(savedHtml);
    if (savedCss) setCssCode(savedCss);
    if (savedJs) setJsCode(savedJs);
  }, []);

  useEffect(() => {
    // Save code to localStorage whenever it changes
    localStorage.setItem("editorHtml", htmlCode);
    localStorage.setItem("editorCss", cssCode);
    localStorage.setItem("editorJs", jsCode);
  }, [htmlCode, cssCode, jsCode]);

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

      {/* Main Content - Full Editor */}
      <div className="flex-1 flex flex-col">
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
            value={getCurrentCode()}
            onChange={(value) => setCurrentCode(value || "")}
            theme="vs-dark"
            options={editorOptions}
          />
        </div>
      </div>
    </div>
  );
};