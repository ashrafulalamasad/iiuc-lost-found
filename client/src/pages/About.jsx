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
    skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Firebase', 'Tailwind CSS', 'Socket.io'],
    achievements: [
      'Built end-to-end Lost & Found platform',
      'Implemented secure authentication system',
      'Implemented chat feature for real-time communication',
      'Designed intuitive UI/UX',
      'Integrated cloud storage for images',
      'Ensured data privacy and security'
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
    <div className="pt-28 pb-12 min-h-screen" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        {/* Hero Mission Section */}
        <div className="relative bg-linear-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl shadow-2xl px-3 py-6 sm:px-12 sm:py-12 mb-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <img src="/iiuc-logo.png" alt="" className="h-32 w-32 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Our Mission</h1>
            <p className="text-lg sm:text-xl text-white leading-relaxed max-w-4xl mx-auto">
              IIUC Lost & Found is dedicated to helping the students of International Islamic University Chittagong recover their lost belongings. We believe in the honesty and integrity of our students, and this platform serves as a bridge between those who lose items and those who find them.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-black mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-200 backdrop-blur-sm rounded-xl border-3 border-black px-4 sm:px-6 py-2 sm:py-6 hover:border-green-600 hover:bg-gray-300 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-bold text-black text-xl mb-2">{feature.title}</h3>
                <p className="text-black">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-24 pt-12">
          <h2 className="text-4xl font-bold text-black mb-8 text-center">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {developer.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center px-5 sm:px-6 py-3 sm:py-4 bg-black text-white rounded-2xl text-sm sm:text-md md:text-lg font-semibold hover:bg-green-600 hover:text-black hover:scale-110 transition-all duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Developer Profile */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-black mb-8 text-center">Meet the Developer</h2>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white backdrop-blur-sm rounded-xl border border-neutral-700 overflow-hidden">
              <div className="md:flex">
                {/* Profile Image Side */}
                <div className="md:w-2/5 bg-linear-to-br from-green-600 to-emerald-700 p-8 flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-black transform hover:scale-105 transition-transform duration-300">
                      <img 
                        src={developer.image} 
                        alt={developer.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Details Side */}
                <div className="md:w-3/5 px-4 sm:px-8 py-8">
                  <div className="mb-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-black mb-2">{developer.name}</h3>
                    <p className="text-green-700 font-semibold text-lg mb-3">{developer.role}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 border text-black rounded-lg text-md font-medium">
                        <BookOpen size={14} />
                        {developer.batch}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-sm font-medium">
                        {developer.university}
                      </span>
                    </div>
                  </div>

                  <p className="text-black text-lg mb-6 leading-relaxed">{developer.bio}</p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                      <Award size={24} className="text-green-400" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {developer.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-md sm:text-lg text-green-700">
                          <span className="text-green-700">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 pt-4 border-t border-neutral-700">
                    <a 
                      href={developer.github} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-green-600 hover:text-black text-md font-medium hover:scale-105 duration-200 transition-transform"
                    >
                      <Github size={24} />
                      GitHub
                    </a>
                    <a 
                      href={developer.linkedin} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className="flex items-center gap-2 px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-black hover:text-sky-400  text-md font-medium hover:scale-105 duration-200 transition-transform"
                    >
                      <Linkedin size={24} />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="relative bg-linear-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-white mb-8 text-lg sm:text-xl">
              Have suggestions, feedback, or facing issues? I'd love to hear from you!
            </p>
            <a 
              href={`mailto:${developer.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-xl rounded-2xl font-semibold hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Mail size={24} />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
