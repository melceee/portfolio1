import FixedModal from "./ui/FixedModal";

export default function ProjectModal({ project, isOpen, onClose }) {
  return (
    <FixedModal
      open={isOpen}
      onClose={onClose}
      title={project?.title}
      subtitle={project?.subtitle || project?.category}
    >
      {project ? (
        <div className="space-y-5">
          {project.summary ? (
            <p className="text-sm text-neutral-300">{project.summary}</p>
          ) : null}

          {project.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {project.details ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h4 className="text-sm font-semibold text-white">Details</h4>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {project.details}
              </p>
            </div>
          ) : null}

          {project.images?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {project.images.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={project.title}
                  className="w-full rounded-2xl border border-white/10 object-cover"
                  draggable={false}
                />
              ))}
            </div>
          ) : null}

          {project.links?.length ? (
            <div className="flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </FixedModal>
  );
}
