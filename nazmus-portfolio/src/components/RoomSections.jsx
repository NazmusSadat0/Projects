import { useEffect, useRef } from "react";

const projects = [
  {
    title: "KUET Empty Room",
    text: "A campus space booking project.",
    tags: "React · Supabase",
    live: "",
    github: "",
  },
  {
    title: "Farm Management",
    text: "A farm management interface.",
    tags: "React",
    live: "",
    github: "",
  },
];

const contact = {
  email: "",
  github: "",
  linkedin: "",
};

const titles = {
  projects: "Selected projects",
  about: "About me",
  contact: "Let’s talk",
};

export default function RoomSections({
  section,
  onClose,
}) {
  const dialog = useRef();

  useEffect(() => {
    const element = dialog.current;

    if (!element.open) {
      element.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialog}
      className="portfolio-dialog"
      aria-labelledby="section-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close();
        }
      }}
    >
      <div className="portfolio-panel">
        <header className="portfolio-panel-header">
          <span className="portfolio-eyebrow">
            NAZMUS / {section.toUpperCase()}
          </span>

          <button
            type="button"
            className="portfolio-close"
            onClick={() => dialog.current.close()}
            aria-label="Close section"
            autoFocus
          >
            ×
          </button>
        </header>

        <h1 id="section-title">
          {titles[section]}
        </h1>

        {section === "projects" && (
          <div className="portfolio-projects">
            {projects.map((project, index) => (
              <article
                className="portfolio-project"
                key={project.title}
              >
                <span className="portfolio-project-number">
                  0{index + 1}
                </span>

                <h2>{project.title}</h2>
                <p>{project.text}</p>
                <small>{project.tags}</small>

                <div className="portfolio-links">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live project ↗
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source code ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {section === "about" && (
          <div className="portfolio-copy">
            <p>
              I’m Nazmus, a CSE student at KUET. I build
              web applications and automation tools.
            </p>

            <div className="portfolio-tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>Automation</span>
            </div>
          </div>
        )}

        {section === "contact" && (
          <div className="portfolio-copy">
            <p>
              Have a project in mind? Let’s connect.
            </p>

            <div className="portfolio-contact-links">
              {contact.email && (
                <a href={`mailto:${contact.email}`}>
                  Email ↗
                </a>
              )}

              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              )}

              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>

            {!Object.values(contact).some(Boolean) && (
              <p className="portfolio-muted">
                Contact details coming soon.
              </p>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}