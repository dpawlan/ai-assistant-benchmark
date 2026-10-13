import { Metadata } from 'next';
import Link from 'next/link';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import { CATEGORY_DESCRIPTIONS, getAgents, getCategories, getTaskSet } from '@/lib/data';
import { Agent, Category } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Dimensions',
  description: 'Explore General assistant dimensions, published tests, scoring anchors and results.',
};

export default function CategoriesPage() {
  const categories = getCategories();
  const tasks = getTaskSet();
  const agents = getAgents();

  return (
    <div className="wrap">
      <div className="ag-top"><Link className="back" href="/">← General assistants</Link></div>
      <div className="page-head">
        <h1 className="page-title">Dimensions</h1>
        <p className="page-sub">{categories.length} dimensions for everyday AI assistance.<br />Open one to see what it tests, how it is evaluated, and the results.</p>
      </div>

      <BenchmarkNav active="general" section="dimensions" />

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">{categories.length} dimensions</span>
        </h2>
        <div className="cat-list">
          {categories.map((c, i) => (
            <CategoryRow key={c.key} category={c} n={i + 1} task={tasks.tasks.find(t => t.key === c.key)?.task} agents={agents} />
          ))}
        </div>
      </section>

      <section className="how" id="how">
        <h2 className="ag-h2">How scoring works</h2>
        <BenchmarkNav active="general" section="scoring" />
        <p className="ag-sub">
          One published task per dimension, scored 1–10 against written anchors after real use. No score without a logged run.
        </p>
        <p className="ag-sub">Travel remains part of General. Its score draws from the <Link href="/benchmarks/travel/dimensions#how">detailed Travel benchmark</Link> once all travel dimensions are tested; existing scores remain until then.</p>
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
    <Link href={`/dimensions/${category.key}`} className="cat-row" id={category.key}>
      <span className="cat-num">{n}</span>
      <span className="cat-body">
        <span className="cat-label">{category.label}</span>
        <span className="cat-desc">{task ? `Test: ${task}. ` : ''}{CATEGORY_DESCRIPTIONS[category.key] ?? ''}{category.scored === false ? ' Subjective, so it is read from public quotes rather than scored.' : ''}</span>
      </span>
      <span className="row-slot">
        {category.scored === false ? (
          <span className="pill muted">Public opinion only</span>
        ) : (
          <span className={`pill${tested ? '' : ' muted'}`}>{tested ? `${tested} tested` : 'Untested'}</span>
        )}
      </span>
    </Link>
  );
}
