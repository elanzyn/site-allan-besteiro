import { useEffect, useMemo, useRef } from 'react'
import { ArrowUpRight, Instagram, Menu, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { projects as allProjects } from './data/projects'
import { galleryItems } from './data/gallery'

function Placeholder({ label = 'Fotografia a inserir' }) {
  return <div className="image-placeholder"><span>{label}</span></div>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => setOpen(false), [location.pathname, location.hash])
  const links = [['Início', '/#inicio'], ['Sobre', '/#sobre'], ['Projetos', '/projetos'], ['Galeria', '/#galeria'], ['Contato', '/#contato']]
  const navigateTo = (event, href) => {
    if (!href.includes('#')) {
      setOpen(false)
      return
    }
    event.preventDefault()
    const hash = href.slice(href.indexOf('#'))
    setOpen(false)
    if (location.pathname !== '/') navigate('/')
    window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }
  return (
    <header className={`site-header ${location.pathname !== '/' ? 'inner-header' : ''}`}>
      <div className="container nav-wrap">
        <Link to="/#inicio" onClick={event => navigateTo(event, '/#inicio')} className="wordmark" aria-label="Allan Besteiro, início">
          <span>ALLAN</span><strong>BESTEIRO</strong>
        </Link>
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}<span className="sr-only">Menu</span>
        </button>
        <nav id="main-menu" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map(([label, href]) => <Link key={label} to={href} onClick={event => navigateTo(event, href)}>{label}</Link>)}
          <Link className="nav-cta" to="/projetos">Acompanhe o mandato <ArrowUpRight size={16} /></Link>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-slash" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span /> Marituba, Pará</p>
          <h1>Trabalho que <em>transforma.</em><br />Resultados que aparecem.</h1>
          <p className="hero-lead">Conheça as ações, os projetos e o trabalho do mandato em Marituba.</p>
          <Link className="button button-yellow" to="/projetos">Ver todos os feitos <ArrowUpRight size={18} /></Link>
        </div>
        <div className="hero-portrait reveal delay-1"><Placeholder label="Retrato do vereador a inserir" /><span className="portrait-note">IDENTIDADE<br />&nbsp;PRESENTE</span></div>
      </div>
      <div className="hero-footer container"><span>MANDATO PRESENTE</span><span className="scroll-note">Role para conhecer <span className="scroll-line" /></span></div>
    </section>
  )
}

function SectionHeading({ eyebrow, title, text, light = false }) {
  return <div className={`section-heading reveal ${light ? 'light' : ''}`}>
    <p className="eyebrow"><span /> {eyebrow}</p><h2>{title}</h2>{text && <p className="section-lead">{text}</p>}
  </div>
}

function ProjectCard({ project }) {
  return <article className="project-card reveal">
    <div className="project-image"><Placeholder label={project.imageLabel} /><span className="project-status">{project.status}</span></div>
    <div className="project-content"><p className="card-kicker">{project.category}</p><h3>{project.title}</h3><p>{project.summary}</p><div className="project-meta"><span>{project.location}</span><Link to={`/projetos/${project.slug}`}>Ver detalhes <ArrowUpRight size={15} /></Link></div></div>
  </article>
}

function FeaturedProjects() {
  return <section className="section projects-section" id="projetos">
    <div className="container"><SectionHeading eyebrow="Em destaque" title="A presença que se constrói no dia a dia." text="Dois espaços reservados para projetos documentados do mandato." />
    <div className="projects-grid">{allProjects.slice(0, 2).map(project => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="center-link"><Link className="text-link" to="/projetos">Conheça todos os feitos <ArrowUpRight size={17} /></Link></div>
    </div>
  </section>
}

function About() {
  return <section className="about-section" id="sobre"><div className="container about-grid">
    <div className="about-photo reveal"><Placeholder label="Foto do vereador a inserir" /><div className="about-stamp">MARITUBA<br /><strong>PA</strong></div></div>
    <div className="about-copy"><SectionHeading eyebrow="Sobre o vereador" title="Uma trajetória feita de presença." text="A biografia e a trajetória completa serão publicadas aqui após o envio de informações verificadas." /><Link className="button button-outline" to="/trajetoria">Conheça a trajetória <ArrowUpRight size={18} /></Link></div>
  </div></section>
}

function GraphicBand() {
  return <div className="graphic-band" aria-hidden="true"><span>MARITUBA</span><i /><span>MANDATO PRESENTE</span><i /><span>TRABALHO QUE TRANSFORMA</span><i /><span>MARITUBA</span></div>
}

function Gallery() {
  const [selected, setSelected] = useState(null)
  const closeButtonRef = useRef(null)
  useEffect(() => {
    const onKey = event => event.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (selected) closeButtonRef.current?.focus()
  }, [selected])
  return <><GraphicBand /><section className="section gallery-section" id="galeria"><div className="container"><SectionHeading eyebrow="Galeria" title="Presença que se vê." text="Registros de visitas, reuniões e atividades públicas do mandato." />
    <div className="gallery-grid">{galleryItems.map((item, index) => <button type="button" className={`gallery-item gallery-${index + 1} reveal`} key={item.id} onClick={() => setSelected(item)} aria-label={`Ampliar: ${item.label}`}><Placeholder label={item.label} /></button>)}</div>
  </div>
  {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagem ampliada" onClick={() => setSelected(null)}><div onClick={event => event.stopPropagation()}><button type="button" ref={closeButtonRef} className="lightbox-close" onClick={() => setSelected(null)} aria-label="Fechar imagem"><X /></button><Placeholder label={selected.label} /></div></div>}
  </section></>
}

function Contact() {
  return <section className="contact-section" id="contato"><div className="container contact-grid"><div><SectionHeading light eyebrow="Gabinete" title="Vamos conversar." text="Os canais oficiais de atendimento serão inseridos assim que confirmados." /></div><div className="contact-card"><div className="contact-row"><span>Telefone</span><strong>A confirmar</strong></div><div className="contact-row"><span>Endereço</span><strong>A confirmar</strong></div><div className="contact-row"><span>Atendimento</span><strong>A confirmar</strong></div><div className="contact-actions"><span className="muted-action"><Instagram size={18} /> Instagram em breve</span><span className="muted-action"><MessageCircle size={18} /> WhatsApp em breve</span></div></div></div></section>
}

function Footer() {
  return <footer><div className="container footer-wrap"><span className="wordmark"><span>ALLAN</span><strong>BESTEIRO</strong></span><span>Mandato presente em Marituba.</span><span>© {new Date().getFullYear()} · Identificação institucional</span></div></footer>
}

function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return <><Hero /><FeaturedProjects /><About /><Gallery /><Contact /></>
}

function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [status, setStatus] = useState('Todos')
  const categories = useMemo(() => ['Todas', ...new Set(allProjects.map(project => project.category))], [])
  const statuses = useMemo(() => ['Todos', 'Proposto', 'Aprovado', 'Em andamento', 'Concluído', 'Arquivado ou não executado', 'Pendente de documentação'], [])
  const filteredProjects = allProjects.filter(project => {
    const searchable = `${project.title} ${project.summary} ${project.description}`.toLocaleLowerCase()
    return searchable.includes(query.toLocaleLowerCase()) && (category === 'Todas' || project.category === category) && (status === 'Todos' || project.status === status)
  })
  return <main className="inner-page"><div className="container inner-hero"><p className="eyebrow"><span /> Mandato</p><h1>Todos os feitos.</h1><p>Consulte proposições, ações e projetos com distinção entre autoria parlamentar, situação e execução. Registros sem documentação permanecem sinalizados como pendentes.</p></div>
    <div className="container projects-tools" aria-label="Filtros de projetos">
      <label className="search-field">Buscar <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Título ou descrição" /></label>
      <label>Categoria <select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Situação <select value={status} onChange={event => setStatus(event.target.value)}>{statuses.map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="container result-summary" aria-live="polite">{filteredProjects.length} {filteredProjects.length === 1 ? 'registro encontrado' : 'registros encontrados'}</div>
    <div className="container project-list">{filteredProjects.length ? filteredProjects.map(project => <ProjectCard key={project.id} project={project} />) : <div className="empty-state"><h2>Nenhum registro corresponde aos filtros.</h2><p>Tente remover um filtro ou alterar os termos da busca.</p></div>}</div>
  </main>
}

function ProjectDetails() {
  const { slug } = useParams()
  const project = allProjects.find(item => item.slug === slug)
  if (!project) return <main className="inner-page"><div className="container inner-hero"><p className="eyebrow"><span /> Mandato</p><h1>Registro não encontrado.</h1><Link className="button button-yellow" to="/projetos">Voltar aos feitos <ArrowUpRight size={18} /></Link></div></main>
  return <main className="inner-page detail-page"><div className="container"><Link className="back-link" to="/projetos">← Voltar aos feitos</Link><div className="detail-header"><p className="eyebrow"><span /> {project.category}</p><h1>{project.title}</h1><p className="detail-summary">{project.summary}</p></div><div className="detail-layout"><div className="detail-main"><div className="detail-image"><Placeholder label={project.imageLabel} /></div>{project.gallery.length > 0 && <div className="detail-gallery" aria-label="Galeria do registro">{project.gallery.map(image => <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />)}</div>}<h2>Sobre este registro</h2><p>{project.description}</p><h2>Documentação</h2>{project.officialSources.length ? <ul>{project.officialSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowUpRight size={14} /></a></li>)}</ul> : <p className="pending-note">Fonte oficial pendente de envio e verificação.</p>}</div><aside className="detail-facts"><div><span>Situação</span><strong>{project.status}</strong></div><div><span>Atuação parlamentar</span><strong>{project.councilorRole}</strong></div><div><span>Data da proposição</span><strong>{project.proposalDate}</strong></div><div><span>Localidade</span><strong>{project.location}</strong></div></aside></div></div></main>
}

function App() {
  return <><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/projetos" element={<ProjectsPage />} /><Route path="/projetos/:slug" element={<ProjectDetails />} /><Route path="/trajetoria" element={<main className="inner-page"><div className="container inner-hero"><p className="eyebrow"><span /> Trajetória</p><h1>Uma história a contar.</h1><p>As informações biográficas verificadas serão inseridas nesta página.</p></div></main>} /></Routes><Footer /></>
}

export default App
