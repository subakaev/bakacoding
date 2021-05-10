import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

interface MarkdownTextProps {
  text: string;
}

const MarkdownText = ({ text }: MarkdownTextProps) => {
  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={{ code: CodeBlock }}>
      {text}
    </ReactMarkdown>
  );
};

export default MarkdownText;
