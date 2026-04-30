"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useCyberSounds } from "@/hooks/useCyberSounds";

interface Project {
  title: string;
  subtitle: string;
  metrics: string;
  image: string;
  link: string;
  color: string;
}

const projects: Project[] = [
  {
    title: "Q-Ecosystem",
    subtitle: "B2B SaaS Platform",
    metrics: "Architected 4 micro-apps via Turborepo. Achieved sub-80ms p99 latency & sub-200ms FCP. Strict RLS and RBAC.",
    image: "/projects/q-ecosystem.png",
    link: "https://www.qrento.in",
    color: "#00f3ff",
  },
  {
    title: "AI Resume Builder",
    subtitle: "Generative Platform",
    metrics: "Delivered sub-second first-token latency. 92% ATS extraction accuracy. Slashed PDF rendering memory by 40%.",
    image: "/projects/resume-builder.png",
    link: "https://ai-resume-builder-theta-azure.vercel.app",
    color: "#bc13fe",
  },
  {
    title: "PawAlert",
    subtitle: "Gov-Tech Infrastructure",
    metrics: "Scaled Node infrastructure to 5,000+ concurrent WebSockets. Slashed staleness by 80%. 99.9% webhook delivery.",
    image: "/projects/pawalert.png",
    link: "https://www.pawalert.in",
    color: "#ff003c",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-32 px-4 md:px-20 z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-9xl font-black mb-32 uppercase tracking-tighter text-center opacity-20">
          Selected<br/>Works
        </h2>

        <div className="space-y-40 md:space-y-64">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  const { playWhoosh } = useCyberSounds();

  return (
    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
      {/* 3D Tilt Image */}
      <div className="w-full md:w-1/2">
        <TiltCard image={project.image} color={project.color} />
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xl font-bold uppercase tracking-[0.3em] text-gray-500 mb-2 block">
            {project.subtitle}
          </span>
          <h3 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight">
            {project.title}
          </h3>
          <div className="glass p-6 md:p-8 border-l-4" style={{ borderLeftColor: project.color }}>
            <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
              {project.metrics}
            </p>
          </div>
          <div className="mt-10">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhoosh()}
              className="inline-block text-xl font-black border-b-2 border-white/20 hover:border-white transition-all pb-1 interactive"
            >
              EXPLORE PROJECT {"->"}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TiltCard({ image, color }: { image: string; color: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative aspect-video w-full glass rounded-xl overflow-hidden group interactive shadow-2xl"
    >
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500" 
        style={{ background: `radial-gradient(circle at center, ${color}, transparent)` }}
      />
      
      {/* Project Image */}
      <div className="relative w-full h-full bg-[#111]">
         <Image 
          src={image} 
          alt="Project Mockup" 
          fill 
          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          onError={(e) => {
            // Silently handle missing image
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
         />
      </div>

      {/* Floating 3D element */}
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="absolute bottom-6 right-6 px-4 py-2 glass border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-xl"
      >
        Live Preview
      </div>
    </motion.div>
  );
}
