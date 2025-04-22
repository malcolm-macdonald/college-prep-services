import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Book, CheckCircle2, Timer, MonitorPlay } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Services = () => {
  const collegeAppRef = useRef<HTMLDivElement>(null);
  const satPrepRef = useRef<HTMLDivElement>(null);
  const tutoringRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  useEffect(() => {
    // Handle scroll on mount and when hash changes
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const targetRef = 
          hash === '#college-counseling' ? collegeAppRef :
          hash === '#sat-prep' ? satPrepRef :
          hash === '#tutoring' ? tutoringRef :
          null;

        if (targetRef?.current) {
          const yOffset = -100; // Offset for fixed header
          const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const serviceFeatures = [
    {
      title: "College Application Counseling",
      description: "Receive expert support for essays, scholarships, and finding the perfect college fit just for you!",
      icon: <GraduationCap size={32} />,
      ref: collegeAppRef,
      id: "college-counseling",
      features: [
        "Personalized college selection strategy",
        "Application timeline management",
        "Essay coaching and review",
        "Interview preparation",
        "Scholarship application assistance",
        "Financial aid guidance"
      ],
      detailedServices: [
        {
          title: "Essay Counseling",
          features: [
            "Expert Review: Have essays evaluated by experienced professionals.",
            "Detailed Feedback: Receive constructive comments and suggestions to improve writing.",
            "Improve Clarity: Ensure ideas are clearly communicated and effectively structured.",
            "Polish Your Work: Get guidance on refining grammar, style, and tone.",
            "Unlimited Review: Iterate as many times as needed, we'll work with your student on an essay until it's right."
          ],
          pricing: [
            "1 Essay | $75",
            "5 Essays | $359",
            "10 Essays | $674"
          ]
        },
        {
          title: "Application Counseling",
          features: [
            "Unlimited Essay Editing: Receive ongoing expert feedback to perfect your student's college essays.",
            "Scholarship Guidance: Get personalized assistance in finding and applying for scholarships.",
            "College Fit Counseling: Explore and identify colleges that align with your student's goals, interests, and needs.",
            "Monthly Meetings: Participate in regular online sessions for continuous support throughout the application process.",
            "End-to-End Support: We're with you every step of the way until your student makes their final college decision."
          ],
          pricing: ["$899"]
        },
        {
          title: "Total College Counseling",
          features: [
            "Application Counseling: Includes everything from Application Counseling plus more.",
            "Unlimited Mock Interviews: Practice and perfect interview skills with expert-led sessions.",
            "College Tour Navigation: Receive guidance on how to make the most of college visits, including what to look for and questions to ask.",
            "Application Success Seminar: Attend a comprehensive seminar designed to teach strategies for excelling on any application, college or professional.",
            "Comprehensive Support: Get all the tools and advice needed to confidently navigate the college admissions process."
          ],
          pricing: ["$1499"]
        }
      ]
    },
    {
      title: "SAT Prep Classes",
      description: "Unlock your potential with our SAT prep classes. Choose between a fast-paced class to prepare on a short timeframe or an extended program to reach mastery on the SAT. Both courses enhance your student's learning with small-group classes. Our expert instructors provide engaging lessons and practice tests that build confidence and open doors to your student's dream college! Learn more about our SAT Prep courses below.",
      icon: <BookOpen size={32} />,
      ref: satPrepRef,
      id: "sat-prep",
      features: [
        "Comprehensive content review",
        "Test-taking strategies",
        "Practice with real SAT questions",
        "Personalized study plans",
        "Regular progress assessments",
        "Small group and individual sessions"
      ],
      detailedServices: [
        {
          title: "SAT Crash Course Class",
          features: [
            "Unlock Mastery: 10+ hours of lessons and practice covering every type of question on the SAT.",
            "Instructor-Led Classes: Includes 4 small-group classes delivered in-person or online, allowing for personalized instruction, interactive learning, and an enriching learning community.",
            "One-on-One Checkpoints: Personalized meetings with an instructor to get tailored SAT tutoring and address specific needs.",
            "Condensed Course: The perfect course for a tight schedule or a quick turnaround between consecutive SATs.",
            "Trial Period: Try out the first two class sessions risk free. A full refund will be issued if your student doesn't wish to finish the course."
          ],
          pricing: ["$288"]
        },
        {
          title: "SAT Mastery Class",
          features: [
            "Unlock Mastery: 17+ hours of lessons and practice covering every type of question on the SAT.",
            "Instructor-Led Classes: Includes 7 small-group classes delivered in-person or online, allowing for personalized instruction, interactive learning, and an enriching learning community.",
            "One-on-One Checkpoints: Personalized meetings with an instructor to get tailored SAT tutoring and address specific needs.",
            "Flexible Scheduling: Easily sign up for class times that fit your family's schedule, so your student can learn when it's most convenient.",
            "Trial Period: Try out the first two class sessions risk free. A full refund will be issued if your student doesn't wish to finish the course."
          ],
          pricing: ["$489"]
        }
      ]
    },
    {
      title: "Individual Tutoring",
      description: "Subject-Specific Expertise: Get matched with a tutor who specializes in the high school course material your student needs help with.",
      icon: <Book size={32} />,
      ref: tutoringRef,
      id: "tutoring",
      features: [
        "Personalized Tutoring: Sessions are tailored to your student's unique learning style and academic goals.",
        "Flexible Online Meetings: Convenient 1-on-1 tutoring sessions held online, fitting easily into your family's schedule.",
        "Comprehensive Support: Whether your student needs help with homework, exam prep, or mastering complex concepts, we've got them covered.",
        "Starting at $87/hour"
      ]
    }
  ];

  const coursesTutored = [
    "Algebra I", "Algebra II", "Geometry", "Trigonometry", "Precalculus",
    "AP Calculus AB (I)", "AP Calculus BC (II)", "Physics (Honors or Standard)",
    "AP Physics 1 and 2 (Algebra Based)", "AP Physics C (Calculus Based",
    "Chemistry (Honors or Standard)", "AP Chemistry", "Organic Chemistry",
    "Biology (Honors or Standard)", "AP Biology"
  ];

  const scrollToService = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const yOffset = -100; // Offset for fixed header
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-brand-light">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
              <p className="text-lg text-brand-dark/80 leading-relaxed mb-8">
                We provide top-notch college prep services that empower students to excel. From personalized SAT tutoring to expert college essay guidance, we're here to help you navigate the journey to your dream school with confidence and ease.
              </p>
              
              {/* Service Quick Links */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {serviceFeatures.map((service) => (
                  <Button
                    key={service.id}
                    onClick={() => scrollToService(service.ref)}
                    className="bg-[rgb(87,155,142)] hover:bg-[rgb(87,155,142)]/90 text-white border-none shadow-sm flex items-center gap-2"
                  >
                    <div className="text-white">
                      {service.icon}
                    </div>
                    <span>{service.title}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Detail Section */}
        <section className="py-20 bg-white">
          <div className="container px-6 mx-auto">
            <div className="space-y-24">
              {serviceFeatures.map((service, index) => (
                <div 
                  key={service.title}
                  ref={service.ref}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
                    index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  } ${
                    index === 0 ? 'pb-12 border-b-2 border-[rgb(87,155,142)]' : 
                    index === 1 ? 'pb-12 border-b-2 border-[rgb(87,155,142)]' : 'pb-0'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                  >
                    <div className="text-brand-teal mb-2">{service.icon}</div>
                    <h2 className="text-3xl md:text-4xl font-bold">{service.title}</h2>
                    <p className="text-lg text-brand-dark/80 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 size={20} className="text-brand-teal mt-1 mr-3 flex-shrink-0" />
                          <span className="text-brand-dark/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {service.title !== "College Application Counseling" && service.title !== "SAT Prep Classes" && (
                      <div className="pt-4">
                        <Button asChild className="rounded-full px-6 bg-[rgb(87,155,142)] hover:bg-[rgb(87,155,142)]/90 text-white">
                          <Link to="/schedule">
                            Schedule a Free Consultation
                          </Link>
                        </Button>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className={index % 2 === 1 ? 'lg:col-start-1' : ''}
                  >
                    <img 
                      src={
                        index === 0 
                          ? `${import.meta.env.BASE_URL}college-app-help.png`
                          : index === 1 
                            ? `${import.meta.env.BASE_URL}sat-prep.png`
                            : `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80`
                      } 
                      alt={service.title} 
                      className="rounded-2xl shadow-lg w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Detailed Services Accordion */}
                  {service.detailedServices && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="col-span-1 lg:col-span-2 -mt-4"
                    >
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {service.detailedServices.map((detailedService, idx) => (
                          <AccordionItem 
                            key={idx} 
                            value={`item-${idx}`}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-brand-teal/30 transition-colors"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50">
                              <div className="flex items-center gap-4">
                                {service.title === "SAT Prep Classes" ? (
                                  detailedService.title === "SAT Crash Course Class" ? (
                                    <Timer size={24} className="text-brand-teal" />
                                  ) : (
                                    <MonitorPlay size={24} className="text-brand-teal" />
                                  )
                                ) : (
                                  idx === 0 ? (
                                    <BookOpen size={24} className="text-brand-teal" />
                                  ) : idx === 1 ? (
                                    <GraduationCap size={24} className="text-brand-teal" />
                                  ) : (
                                    <Book size={24} className="text-brand-teal" />
                                  )
                                )}
                                <h3 className="text-2xl font-semibold text-brand-dark">
                                  {detailedService.title}
                                </h3>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-6">
                                <ul className="space-y-3">
                                  {detailedService.features.map((feature, featureIdx) => (
                                    <li key={featureIdx} className="flex items-start">
                                      <CheckCircle2 size={18} className="text-brand-teal mt-1 mr-3 flex-shrink-0" />
                                      <span className="text-lg text-brand-dark/80">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="space-y-2">
                                  {detailedService.pricing.map((price, priceIdx) => (
                                    <p key={priceIdx} className="text-xl font-semibold text-brand-teal">
                                      {price}
                                    </p>
                                  ))}
                                </div>
                                {service.title !== "SAT Prep Classes" && (
                                  <Button asChild className="rounded-full px-6 bg-[rgb(87,155,142)] hover:bg-[rgb(87,155,142)]/90 text-white">
                                    <Link to="/schedule">
                                      Schedule a Free Consultation
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses We Tutor Section */}
        <section className="pt-8 pb-20 bg-white">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Courses We Tutor</h2>
              <p className="text-lg text-brand-dark/70 max-w-2xl mx-auto">
                Our experienced tutors provide support across a wide range of high school subjects, including:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[0, 1, 2].map((columnIndex) => (
                <motion.div
                  key={columnIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * columnIndex }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="space-y-4"
                >
                  <ul className="space-y-2">
                    {coursesTutored
                      .slice(columnIndex * 5, columnIndex * 5 + 5)
                      .map((subject) => (
                        <li key={subject} className="flex items-center">
                          <CheckCircle2 size={16} className="text-brand-teal mr-2 flex-shrink-0" />
                          <span>{subject}</span>
                        </li>
                      ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Referral Promotion Section */}
        <section className="py-16 bg-[rgb(87,155,142)] mb-12">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center text-white"
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
                Get 10% Back for Every Friend You Recommend*
              </h2>
              <p className="text-xs text-white/90">
                *Up to a 50% total refund/discount. Recommended friends must sign up and pay before refunds are issued.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/40 to-brand-teal/40" />
          
          <div className="container px-6 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Achieve Your Academic Goals?</h2>
              <p className="text-lg text-white/90 mb-10 leading-relaxed">
                Contact us today to learn more about our services or to schedule your first session.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-8 bg-[rgb(87,155,142)] hover:bg-[rgb(87,155,142)]/90 text-white">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
                <Button asChild size="lg" className="rounded-full px-8 bg-[rgb(87,155,142)] text-white hover:bg-[rgb(87,155,142)]/90 border border-white">
                  <Link to="/schedule">
                    Schedule a Session
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
