import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FunctionComponent } from "react";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  node: any; // TODO
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({
  node,
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
      children={String(children).replace(/\n$/, "")}
      {...props}
    />
  ) : (
    <code className={className} children={children} {...props} />
  );
};

export default CodeBlock;
