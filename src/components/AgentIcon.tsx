import Image from 'next/image';

interface AgentIconProps {
  name: string;
  icon: string | null;
  size?: number;
  className?: string;
}

export function AgentIcon({ name, icon, size = 56, className = '' }: AgentIconProps) {
  return (
    <span className={`row-icon ${className}`.trim()}>
      {icon ? (
        <Image src={icon} alt="" width={size} height={size} />
      ) : (
        <span className="letter" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}
