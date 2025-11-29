import { Github, Linkedin, Mail, Code2, Rocket, Users, Sparkles, Award, BookOpen } from 'lucide-react';
import BackButton from '../components/BackButton';

export default function About() {
  
  const developer = {
    name: 'Ashraful Alam',
    role: 'Full Stack Developer & Project Creator',
    batch: 'CSE 56th Batch',
    university: 'IIUC',
    image: '/profile.webp',
    bio: 'Passionate about creating solutions that make a difference in the community. Building bridges between lost items and their rightful owners.',
    github: 'https://github.com/ashrafulalamasad',
    linkedin: 'https://www.linkedin.com/in/ashrafulalam005',
    email: 'ashrafulalamyt@gmail.com',
    skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Firebase', 'Tailwind CSS'],
    achievements: [
      'Built end-to-end Lost & Found platform',
      'Implemented secure authentication system',
      'Designed intuitive UI/UX',
      'Integrated cloud storage for images'
    ]
  };

  const features = [
    {
      icon: Rocket,
      title: 'Fast & Reliable',
      description: 'Quick reporting and claiming process to reunite items with their owners swiftly.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by student, for students. Fostering a culture of honesty and helping each other.'
    },
    {
      icon: Code2,
      title: 'Modern Tech Stack',
      description: 'Utilizing cutting-edge technologies for a smooth, responsive user experience.'
    },
    {
      icon: Sparkles,
      title: 'User Friendly',
      description: 'Intuitive interface designed to make reporting and finding items effortless.'
    }
  ];

  return (
    <div className="pt-28 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        {/* Hero Mission Section */}
        <div className="relative bg-linear-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-8 sm:p-12 mb-12 text-center overflow-hidden">
          <div className="relative z-10">
            <img src="/iiuc-logo.png" alt="" className="h-32 w-32 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-6">Our Mission</h1>
            <p className="text-xl text-indigo-50 leading-relaxed max-w-4xl mx-auto mb-8">
              "IIUC Lost & Found" is dedicated to helping the students of International Islamic University Chittagong recover their lost belongings. We believe in the honesty and integrity of our students, and this platform serves as a bridge between those who lose items and those who find them.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-24 pt-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {developer.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1 px-4 py-2 bg-gray-200 text-black rounded-full text-md font-bold hover:scale-105 transition-transform duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Developer Profile - Enhanced */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Meet the Developer</h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="md:flex">
                {/* Profile Image Side */}
                <div className="md:w-2/5 bg-linear-to-br from-indigo-600 to-indigo-700 p-8 flex items-center justify-center">
                  <div className="w-full max-w-xs">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-transform duration-300">
                      <img 
                        src={developer.image} 
                        alt={developer.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Details Side */}
                <div className="md:w-3/5 p-8">
                  <div className="mb-4">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">{developer.name}</h3>
                    <p className="text-indigo-600 font-semibold text-lg mb-3">{developer.role}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                        <BookOpen size={14} />
                        {developer.batch}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-slate-700 rounded-lg text-sm font-medium">
                        {developer.university}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">{developer.bio}</p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Award size={16} className="text-indigo-600" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {developer.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <Sparkles size={14} className="text-indigo-600 mt-0.5 shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <a 
                      href={developer.github} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                      <Github size={18} />
                      GitHub
                    </a>
                    <a 
                      href={developer.linkedin} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section - Enhanced */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Have suggestions, feedback, or facing issues? I'd love to hear from you!
          </p>
          <a 
            href={`mailto:${developer.email}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Mail size={22} />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
