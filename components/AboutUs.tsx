
import React from 'react';
import { 
  Book, Activity, ShieldCheck, GraduationCap, Monitor, 
  HeartHandshake, Briefcase, Microscope, Scale, 
  ClipboardCheck, Compass, Globe, Sparkles 
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const components = [
    {
      icon: <Book className="w-6 h-6 text-gold-main" />,
      title: "1. Curriculum",
      details: [
        "Core Courses: Fundamental courses covering anatomy, physiology, medical terminology, and pathology.",
        "Specialized Courses: In-depth courses on abdominal, obstetric, gynecologic, vascular, and cardiac sonography.",
        "Physics and Instrumentation: Mastering sound waves and ultrasound equipment operation."
      ]
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-gold-main" />,
      title: "2. Student Support",
      details: [
        "Academic Advising: Guidance on course selection and career path planning.",
        "Mentoring: Peer and faculty support to ensure academic success.",
        "Counseling: Access to mental health and wellness resources."
      ]
    },
    {
      icon: <Briefcase className="w-6 h-6 text-gold-main" />,
      title: "3. Prof. Development",
      details: [
        "Workshops: Regular seminars on resume writing and interview strategies.",
        "Professional Orgs: Integration with the Society of Diagnostic Medical Sonography (SDMS)."
      ]
    },
    {
      icon: <Microscope className="w-6 h-6 text-gold-main" />,
      title: "4. Research Opportunities",
      details: [
        "Research Projects: Opportunities to conduct original ultrasound technology research.",
        "Publications: Support for presenting and publishing clinical findings."
      ]
    },
    {
      icon: <Scale className="w-6 h-6 text-gold-main" />,
      title: "5. Ethics & Professionalism",
      details: [
        "Ethics Training: Deep dives into patient confidentiality and medical ethics.",
        "Behavioral Standards: Developing professional demeanor and communication skills."
      ]
    },
    {
      icon: <ClipboardCheck className="w-6 h-6 text-gold-main" />,
      title: "6. Assessment",
      details: [
        "Regular Evaluations: Quizzes, exams, and practical skill assessments.",
        "Feedback Loops: Continuous input from supervisors to drive clinical improvement."
      ]
    },
    {
      icon: <Compass className="w-6 h-6 text-gold-main" />,
      title: "7. Career Services",
      details: [
        "Job Placement: Assistance with finding internships, externships, and careers.",
        "Alumni Network: Access to a global community of working sonographers."
      ]
    },
    {
      icon: <Globe className="w-6 h-6 text-gold-main" />,
      title: "8. Community Engagement",
      details: [
        "Outreach: Participating in community health fairs and screenings.",
        "Volunteerism: Encouragement to gain experience in various healthcare settings."
      ]
    }
  ];

  return (
    <section id="about-us" className="relative py-32 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 text-left">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-24 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold-main/10 border border-gold-main/20 text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">
             <Sparkles size={12} /> Our Educational Ecosystem
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            The Pillars of <br/> <span className="text-gold-main italic font-normal">Sonography Mastery</span>
          </h2>
          <p className="text-lg text-slate-300 font-light leading-relaxed font-sans border-l-2 border-gold-main/20 pl-6 italic">
            The key components of an ultrasound program are designed to provide comprehensive education and training to students, ensuring they are well-prepared for careers in sonography. By incorporating these essential components, our program provides a well-rounded education that prepares you for success.
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((item, index) => (
            <div key={index} className="glass-panel group p-8 rounded-[2.5rem] border border-white/5 hover:border-gold-main/30 transition-all duration-700 bg-white/[0.02]">
              <div className="flex flex-col h-full gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-gold-main/10 transition-all duration-500">
                  {item.icon}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-main transition-colors">
                    {item.title}
                  </h3>
                  <ul className="space-y-3">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-[13px] text-slate-400 font-sans leading-relaxed flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-main/30 mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion Banner */}
        <div className="mt-24 p-12 bg-gold-main/5 border border-gold-main/20 rounded-[3rem] text-center backdrop-blur-xl">
           <p className="text-xl md:text-2xl text-slate-200 font-serif font-light leading-relaxed italic max-w-4xl mx-auto">
             "By incorporating these key components, our ultrasound physics review program provides a well-rounded education that prepares <span className="text-gold-main font-bold">you</span> for successful careers in sonography."
           </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
