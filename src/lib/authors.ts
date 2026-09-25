import fs from 'node:fs';
import path from 'node:path';

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  trust: string[];
  photo: string | null;
  links: { label: string; url: string }[];
}

const FILE = path.join(process.cwd(), 'data', 'authors.json');

export function getAuthors(): Author[] {
  try {
    return (JSON.parse(fs.readFileSync(FILE, 'utf8')) as { authors: Author[] }).authors;
  } catch {
    return [];
  }
}

export const getAuthor = (slug: string) => getAuthors().find(a => a.slug === slug) ?? null;
export const getAuthorByName = (name: string) => getAuthors().find(a => a.name === name) ?? null;
export const initials = (name: string) => name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
