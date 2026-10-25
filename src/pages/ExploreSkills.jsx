import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SkillCard from '../components/SkillCard.jsx';
import { categories, skillCatalog } from '../data/initialData.js';
import { useApp } from '../context/AppContext.jsx';
import { getData } from '../utils/storage.js';

export default function ExploreSkills() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All skills');
  const { setToast } = useApp();
  const navigate = useNavigate();
  const catalog = useMemo(() => getData('skills', skillCatalog), []);
  const shown = useMemo(() => catalog.filter((skill) => (category === 'All skills' || skill.category === category) && skill.name.toLowerCase().includes(search.toLowerCase().trim())), [catalog, category, search]);
  return <div className="page-wrap">
    <PageHeader eyebrow="CURIOSITY LOOKS GOOD ON YOU" title="Explore skills" description="Find something new to learn — and the people who can help you get there." />
    <div className="explore-intro"><div><span className="explore-spark"><Sparkles size={17} /></span><strong>There’s always something new to learn.</strong><span> Start with what sparks your curiosity.</span></div><span className="explore-total">{catalog.length} skills to explore</span></div>
    <div className="explore-controls"><label className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search skills, e.g. React or photography" aria-label="Search skills" />{search && <button onClick={() => setSearch('')} aria-label="Clear search">×</button>}</label><span className="filter-label"><SlidersHorizontal size={16} /> Filter by</span></div>
    <div className="category-pills" aria-label="Skill categories"><button className={category === 'All skills' ? 'selected' : ''} onClick={() => setCategory('All skills')}>All skills</button>{categories.map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="results-line"><span>{shown.length} {shown.length === 1 ? 'skill' : 'skills'}</span>{category !== 'All skills' && <button onClick={() => setCategory('All skills')}>Clear filter</button>}</div>
    {shown.length ? <div className="skill-grid">{shown.map((skill) => <SkillCard key={skill.name} skill={skill.name} onFind={(name) => { setToast({ type: 'success', message: `Showing partners who can teach ${name}.` }); navigate(`/matches?skill=${encodeURIComponent(name)}`); }} />)}</div> : <div className="empty-state"><Search size={26} /><h3>No skills found</h3><p>Try another search or choose a different category.</p><button className="button button-outline button-small" onClick={() => { setSearch(''); setCategory('All skills'); }}>Clear filters</button></div>}
  </div>;
}
