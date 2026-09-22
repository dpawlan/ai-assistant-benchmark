import Image from 'next/image';
import { initials, type Author } from '@/lib/authors';

export function AuthorAvatar({ author, name, size = 36, className = '' }: { author?: Author | null; name?: string; size?: number; className?: string }) {
  const label = author?.name ?? name ?? '';
  return (
    <span className={`art-avatar ${className}`.trim()} style={{ width: size, height: size, fontSize: Math.round(size / 3) }} aria-hidden="true">
      {author?.photo ? <Image src={author.photo} alt="" width={size} height={size} /> : initials(label)}
    </span>
  );
}
