import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

interface MarkdownTextProps {
  text: string;
}

const MarkdownText = ({ text }: MarkdownTextProps): JSX.Element => {
  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={{ code: CodeBlock }}>
      {text}
    </ReactMarkdown>
  );
};

export default MarkdownText;
