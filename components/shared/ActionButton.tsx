import Link from 'next/link';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  href?: string;
  Icon?: React.ElementType;
}

const LinkWrapper = ({ href, children }: { href?: string; children: any }) => {
  if (href) {
    return <Link href={href}>{children}</Link>;
  }
  return children;
};

export default function ActionButton({ label, href, Icon, ...props }: ActionButtonProps) {
  return (
    <LinkWrapper href={href}>
      <button {...props}>
        {Icon && <Icon className="h-6 w-6 sm:mr-1 inline-block" />}
        <span className="hidden sm:inline-block">{label}</span>
      </button>
    </LinkWrapper>
  );
}
