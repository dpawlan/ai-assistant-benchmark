import { Agent, AgentsData, CategoriesData, Category, IndexData } from './types';
import agentsJson from '@/../data/agents.json';
import categoriesJson from '@/../data/categories.json';
import indexJson from '@/../data/index.json';

export function getAgents(): Agent[] {
  return (agentsJson as AgentsData).agents;
}

export function getAgent(slug: string): Agent | undefined {
  return getAgents().find(agent => agent.slug === slug);
}

export function getCategories(): Category[] {
  return (categoriesJson as CategoriesData).categories;
}

export function getIndexData(): IndexData {
  return indexJson as IndexData;
}

export function getConfirmedAgents(): Agent[] {
  return getAgents().filter(agent => agent.status === 'confirmed');
}

export function getStretchAgents(): Agent[] {
  return getAgents().filter(agent => agent.status === 'stretch');
}

export function getCoreCategories(): Category[] {
  return getCategories().filter(cat => cat.type === 'core');
}

export function getEndorsedCategories(): Category[] {
  return getCategories().filter(cat => cat.type === 'endorsed');
}

export function getAllSlugs(): string[] {
  return getAgents().map(agent => agent.slug);
}
