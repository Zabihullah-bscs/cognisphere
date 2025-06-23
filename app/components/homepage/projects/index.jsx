import { projectsData } from '@/utils/data/projects-data';
import ProjectCard from './project-card';
import Marquee from "react-fast-marquee";

const Projects = () => {

  return (
    <div id='projects' className="relative z-50  my-12 lg:my-24">
      <div className="sticky top-10">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl  opacity-30"></div>
        <div className="flex items-center justify-center relative">
          <span className="bg-[#1a1443] w-fit gradient-text p-2 px-5 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="pt-24">
        <Marquee
          gradient={false}
          speed={80}
          pauseOnHover={true}
          pauseOnClick={true}
          delay={0}
          play={true}
          direction="left"
        >
          {projectsData.slice(0, 4).map((project, index) => (
            <div
              id={`sticky-card-${index + 1}`}
              key={index}
              className="w-full mx-auto max-w-2xl" // Removed sticky class
            >
              <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s] m-3 sm:m-5"> {/* Added margin */}
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Projects;
