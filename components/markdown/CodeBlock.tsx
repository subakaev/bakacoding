import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FunctionComponent } from "react";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({
  children,
  inline = false,
  className = "",
  ...props
}) => {
  const langMatch = /language-(\w+)/.exec(className || "");
  return !inline && langMatch ? (
    <SyntaxHighlighter
      style={materialLight}
      language={langMatch[1]}
      PreTag="div"
      {...props}>
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default CodeBlock;
