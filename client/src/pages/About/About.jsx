import React from 'react';
import {
  FaHandsHelping,
  FaBullseye,
  FaUsers,
  FaEye,
  FaTasks,
  FaCheckCircle,
  FaLeaf,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGithub,
  FaCodeBranch,
  FaExclamationTriangle,
  FaChartBar,
  FaUserLock,
  FaMobileAlt,
  FaUserCircle
} from 'react-icons/fa';
import './About.css';

const About = () => {
  const objectives = [
    {
      icon: <FaBullseye className="icon-style" />,
      title: 'Citizen Empowerment',
      description: 'Enable citizens to effortlessly report and highlight local issues in real-time.'
    },
    {
      icon: <FaUsers className="icon-style" />,
      title: 'Community Participation',
      description: 'Increase active community involvement and collective responsibility.'
    },
    {
      icon: <FaEye className="icon-style" />,
      title: 'Improve Transparency',
      description: 'Provide clear updates on issue status and resolution progress.'
    },
    {
      icon: <FaTasks className="icon-style" />,
      title: 'Track Issue Status',
      description: 'Real-time monitoring from submission to final resolution.'
    },
    {
      icon: <FaCheckCircle className="icon-style" />,
      title: 'Faster Resolutions',
      description: 'Encourage prompt action and effective problem solving.'
    },
    {
      icon: <FaLeaf className="icon-style" />,
      title: 'Cleaner Neighborhoods',
      description: 'Build safer, greener, and more sustainable local environments.'
    }
  ];

  const technologies = [
    { icon: <FaReact className="tech-icon react" />, name: 'React.js', desc: 'Frontend UI library for reactive web apps.' },
    { icon: <FaNodeJs className="tech-icon node" />, name: 'Node.js', desc: 'JavaScript runtime for server-side code.' },
    { icon: <FaNodeJs className="tech-icon express" />, name: 'Express.js', desc: 'Minimal backend web application framework.' },
    { icon: <FaDatabase className="tech-icon mongo" />, name: 'MongoDB', desc: 'NoSQL database for flexible data storage.' },
    { icon: <FaHtml5 className="tech-icon html" />, name: 'HTML5', desc: 'Standard markup language for web structure.' },
    { icon: <FaCss3Alt className="tech-icon css" />, name: 'CSS3', desc: 'Modern styling and responsive design layout.' },
    { icon: <FaJsSquare className="tech-icon js" />, name: 'JavaScript', desc: 'Core programming logic for the web.' },
    { icon: <FaCodeBranch className="tech-icon router" />, name: 'React Router', desc: 'Client-side routing and navigation.' },
    { icon: <FaGithub className="tech-icon github" />, name: 'Git & GitHub', desc: 'Version control and code repository hosting.' }
  ];

  const features = [
    {
      icon: <FaExclamationTriangle className="feature-icon" />,
      title: 'Issue Reporting',
      description: 'Submit detailed reports for potholes, garbage dumps, water leaks, and street lights.'
    },
    {
      icon: <FaTasks className="feature-icon" />,
      title: 'Issue Tracking',
      description: 'Keep track of reported concerns with status tags like Pending, In Progress, and Resolved.'
    },
    {
      icon: <FaChartBar className="feature-icon" />,
      title: 'Community Dashboard',
      description: 'Comprehensive statistics and breakdown of local community problems.'
    },
    {
      icon: <FaUserLock className="feature-icon" />,
      title: 'User Authentication',
      description: 'Secure account access for community members to manage their reports.'
    },
    {
      icon: <FaMobileAlt className="feature-icon" />,
      title: 'Responsive Design',
      description: 'Seamless experience across desktop, tablet, and mobile devices.'
    },
    {
      icon: <FaUserCircle className="feature-icon" />,
      title: 'Profile Management',
      description: 'Personalized user profiles showing individual activity and contributions.'
    }
  ];

  const teamMembers = [
    {
      initials: 'TM1',
      name: 'Team Member 1',
      role: 'Frontend Developer',
      description: 'Designed the user interface and developed the frontend pages.'
    },
    {
      initials: 'TM2',
      name: 'Team Member 2',
      role: 'Backend Developer',
      description: 'Developed APIs, database integration and server-side logic.'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        
        {/* Page Header */}
        <header className="about-header">
          <h1 className="about-title">About Community Hero</h1>
          <p className="about-subtitle">
            Building stronger communities by empowering citizens to report and solve local issues together.
          </p>
        </header>

        {/* Section 1 - Project Overview */}
        <section className="about-section">
          <div className="overview-card">
            <div className="overview-content">
              <h2 className="section-title">Project Overview</h2>
              <p className="overview-text">
                Community Hero is a Hyperlocal Problem Solver platform that enables citizens to report issues in their locality such as potholes, garbage dumps, water leakage, damaged street lights, drainage problems, and other civic concerns.
              </p>
              <p className="overview-text">
                The platform allows community members to report issues, track their status, and encourage collaboration between citizens and local authorities.
              </p>
              <p className="overview-text">
                The main goal is to improve local communities through digital reporting and transparency.
              </p>
            </div>
            <div className="overview-illustration" aria-hidden="true">
              <FaHandsHelping className="overview-icon" />
            </div>
          </div>
        </section>

        {/* Section 2 - Project Objectives */}
        <section className="about-section">
          <h2 className="section-title text-center">Objectives</h2>
          <div className="grid-responsive">
            {objectives.map((obj, index) => (
              <div key={index} className="info-card">
                <div className="icon-wrapper">{obj.icon}</div>
                <h3 className="card-title">{obj.title}</h3>
                <p className="card-description">{obj.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 - Technologies Used */}
        <section className="about-section">
          <h2 className="section-title text-center">Technologies Used</h2>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-card">
                <div className="tech-icon-wrapper">{tech.icon}</div>
                <h3 className="tech-title">{tech.name}</h3>
                <p className="tech-description">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 - Project Features */}
        <section className="about-section">
          <h2 className="section-title text-center">Key Features</h2>
          <div className="grid-responsive">
            {features.map((feature, index) => (
              <div key={index} className="info-card">
                <div className="icon-wrapper feature-icon-wrapper">{feature.icon}</div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 - Team Members */}
        <section className="about-section">
          <h2 className="section-title text-center">Team Members</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="profile-avatar">{member.initials}</div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p className="member-description">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 - Project Vision */}
        <section className="about-section">
          <div className="vision-card">
            <h2 className="section-title text-center">Our Vision</h2>
            <p className="vision-text">
              Community Hero aims to encourage responsible citizenship, improve communication between communities and authorities, and create cleaner, safer, and more connected neighborhoods through technology.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;