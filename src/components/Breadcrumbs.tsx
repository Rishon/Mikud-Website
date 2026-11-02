import Link from "next/link";
import type { Breadcrumb } from "@/components/Layout";
import { useT } from "@/i18n";

const Breadcrumbs = ({ items }: { items: Breadcrumb[] }) => {
  const { t } = useT();

  return (
    <nav
      aria-label={t.breadcrumbLabel}
      className="text-sm text-mikud-navy/70 mb-6"
    >
      <ol className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <li key={item.path} className="flex gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link
                href={item.path}
                className="hover:text-mikud-purple underline-offset-2 hover:underline"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
