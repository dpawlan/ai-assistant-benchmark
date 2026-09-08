import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORY_DESCRIPTIONS, getAgents, getCategories, getTaskSet } from '@/lib/data';
import { Agent, Category } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'The 14 categories every assistant is scored on: seven core, seven endorsed. Each one is a published test and a ranking.',
};

export default function CategoriesPage() {
  const categories = getCategories();
  const tasks = getTaskSet();
  const agents = getAgents();
  const core = categories.filter(c => c.group === 'core');
  const endorsed = categories.filter(c => c.group === 'endorsed');

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Categories</h1>
        <p className="page-sub">The same {categories.length} tests for every assistant. Open one for the task and the ranking.</p>
      </div>

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Core</span>
        </h2>
        <div className="cat-list">
          {core.map((c, i) => (
            <CategoryRow key={c.key} category={c} n={i + 1} task={tasks.tasks.find(t => t.key === c.key)?.task} agents={agents} />
          ))}
        </div>
      </section>

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Endorsed</span>
        </h2>
        <div className="cat-list">
          {endorsed.map((c, i) => (
            <CategoryRow key={c.key} category={c} n={core.length + i + 1} task={tasks.tasks.find(t => t.key === c.key)?.task} agents={agents} />
          ))}
        </div>
      </section>

      <section className="how" id="how">
        <h2 className="ag-h2">How scoring works</h2>
        <p className="ag-sub">
          One published task per category, scored 1–10 against written anchors after real use. No score without a logged run.
        </p>
        <div className="info-list">
          <div className="info-row">
            <span className="il">A tested score</span>
            <span className="iv">1 – 10</span>
          </div>
          <div className="info-row">
            <span className="il">Not tested yet</span>
            <span className="iv empty">—</span>
          </div>
          <div className="info-row">
            <span className="il">Doesn&apos;t apply to this product</span>
            <span className="iv na">N/A</span>
          </div>
          <div className="info-row">
            <span className="il">Benchmark version</span>
            <span className="iv">v{tasks.version}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryRow({ category, n, task, agents }: { category: Category; n: number; task?: string; agents: Agent[] }) {
  const tested = agents.filter(a => typeof a.scores[category.key] === 'number').length;
  return (
    <Link href={`/categories/${category.key}`} className="cat-row" id={category.key}>
      <span className="cat-num">{n}</span>
      <span className="cat-body">
        <span className="cat-label">{category.label}</span>
        <span className="cat-desc">{task ? `Test: ${task}. ` : ''}{CATEGORY_DESCRIPTIONS[category.key] ?? ''}</span>
      </span>
      <span className="row-slot">
        <span className={`pill${tested ? '' : ' muted'}`}>{tested ? `${tested} tested` : 'Untested'}</span>
      </span>
    </Link>
  );
}
