export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="#top" aria-label="Panat Ruangsri, home">PR</a>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#news">News</a>
        <a href="#works">Works</a>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
      </nav>
      <a className="header-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a>
    </header>
  );
}