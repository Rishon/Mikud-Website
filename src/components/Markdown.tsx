import Link from "next/link";
import type { Block, Inline } from "@/server/markdown";

const renderInlines = (inlines: Inline[]) =>
  inlines.map((inline, index) => {
    if (inline.type === "strong")
      return <strong key={index}>{inline.text}</strong>;
    if (inline.type === "link") {
      const external = /^(https?:|mailto:)/.test(inline.href);
      return (
        <Link
          key={index}
          href={inline.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener" : undefined}
          className="underline underline-offset-2 hover:text-mikud-purple"
        >
          {inline.text}
        </Link>
      );
    }
    return inline.text;
  });

const renderBlock = (block: Block, index: number) => {
  if (block.type === "heading" && block.level >= 3) {
    return (
      <h3 key={index} className="text-lg font-ibm-bold mt-6 mb-2">
        {block.text}
      </h3>
    );
  }
  if (block.type === "heading") {
    return (
      <h2 key={index} className="text-xl font-ibm-bold mt-6 mb-2">
        {block.text}
      </h2>
    );
  }
  if (block.type === "list") {
    return (
      <ul key={index} className="list-disc ps-6 mb-3 space-y-1 leading-relaxed">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInlines(item)}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={index} className="mb-3 leading-relaxed">
      {renderInlines(block.inlines)}
    </p>
  );
};

const Markdown = ({ blocks }: { blocks: Block[] }) => (
  <>{blocks.map(renderBlock)}</>
);

export default Markdown;
