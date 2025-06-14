import React from "react";
import { Button } from "./ui/button";
import { Type, Highlighter, RotateCcw } from "lucide-react";

interface AnnotationToolbarProps {
  onTextInsert?: (text: string) => void;
  onHighlight?: () => void;
  onReset?: () => void;
}

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  onTextInsert = () => {},
  onHighlight = () => {},
  onReset = () => {},
}) => {
  return (
    <div
      className="flex gap-4 my-4 justify-center flex-wrap p-4 bg-muted/50 rounded-lg border border-border"
      data-oid=":.os65q"
    >
      <Button
        onClick={() => onTextInsert("CONFIDENTIAL")}
        className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        data-oid="79vhohk"
      >
        <Type className="w-4 h-4 mr-2" data-oid="m.9-l23" />
        Insert 'CONFIDENTIAL'
      </Button>

      <Button
        onClick={onHighlight}
        variant="outline"
        className="border-primary hover:bg-primary/10"
        data-oid="6k.byha"
      >
        <Highlighter className="w-4 h-4 mr-2" data-oid="8k0i66n" />
        Highlight Section
      </Button>

      <Button
        onClick={onReset}
        variant="outline"
        className="border-destructive text-destructive hover:bg-destructive/10"
        data-oid="9qkv0co"
      >
        <RotateCcw className="w-4 h-4 mr-2" data-oid="t20ilg6" />
        Reset PDF
      </Button>
    </div>
  );
};

export default AnnotationToolbar;
