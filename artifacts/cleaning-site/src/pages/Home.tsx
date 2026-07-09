import React, { useState, useEffect, useRef } from 'react';
import { 
  useGetSettings, 
  useListSlides, 
  useListServices, 
  useListReviews, 
  useListTeamMembers, 
  useGetAbout,
  useSubmitContact,
  useSubmitReview
} from '@workspace/api-client-react';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { HeroCarousel } from '@/components/HeroCarousel';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Phone, Mail, MapPin, Instagram, Menu, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: slides } = useListSlides();
  const { data: services } = useListServices();
  const { data: reviewsData } = useListReviews(); // approved only by default
  const { data: team } = useListTeamMembers();
  const { data: about } = useGetAbout();
  
  const submitContact = useSubmitContact();
  const submitReview = useSubmitReview();
  const { toast } = useToast();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Forms state
  const [contactForm, setContactForm] = useState({ fullName: '', phone: '', email: '', serviceRequired: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({ customerName: '', rating: 5, comment: '' });
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate({ data: contactForm }, {
      onSuccess: () => {
        setContactSuccess(true);
        setContactForm({ fullName: '', phone: '', email: '', serviceRequired: '', message: '' });
        setTimeout(() => setContactSuccess(false), 5000);
      }
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate({ data: reviewForm }, {
      onSuccess: () => {
        setReviewSuccess(true);
        setReviewForm({ customerName: '', rating: 5, comment: '' });
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    });
  };

  // Nav Items filter
  const visibleNav = settings?.navItems?.filter(n => n.visible) || [
    { label: 'Home', href: '#home', visible: true },
    { label: 'Services', href: '#services', visible: true },
    { label: 'Reviews', href: '#reviews', visible: true },
    { label: 'About', href: '#about', visible: true },
    { label: 'Contact', href: '#contact', visible: true },
  ];

  const defaultHeroSlides = [
    { id: 1, heading: 'Premium Cleaning Services', description: 'Experience the pristine difference.', imageUrl: '/api/uploads/hero1.jpg', overlayOpacity: 40, autoplay: true, autoplaySpeed: 5000, sortOrder: 0, createdAt: '' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* Sticky Navbar */}
      <nav 
        id="home"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.siteName || "CleanPro"} className="h-10" />
            ) : (
              <a href="#home" className={cn("text-2xl font-black flex items-center gap-2", isScrolled ? "text-secondary" : "text-white")}>
                <Sparkles className="w-6 h-6 text-primary" />
                {settings?.siteName || "CleanPro"}
              </a>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {visibleNav.map(item => (
              <a 
                key={item.label} 
                href={item.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  isScrolled ? "text-secondary" : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </a>
            ))}
            <a href="#contact">
              <Button className="rounded-full shadow-lg hover:-translate-y-0.5 transition-transform">
                Get a Quote
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={cn("w-6 h-6", isScrolled ? "text-secondary" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", isScrolled ? "text-secondary" : "text-white")} />
            )}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl py-4 px-4 flex flex-col gap-4 md:hidden">
            {visibleNav.map(item => (
              <a 
                key={item.label} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-secondary p-2 hover:bg-accent rounded-lg"
              >
                {item.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-full mt-2">Get a Quote</Button>
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="w-full">
        <HeroCarousel slides={slides?.length ? slides : defaultHeroSlides} />
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">See the difference we make.</h3>
          <p className="text-lg text-gray-500">We offer specialized cleaning services tailored to your exact needs, backed by professional standards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map(service => (
            <Card key={service.id} className="border-0 bg-white hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {service.iconUrl ? (
                    <img src={service.iconUrl} alt="" className="w-12 h-12 rounded-xl object-cover bg-accent" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-secondary">{service.title}</h4>
                </div>
                <p className="text-gray-500 mb-6">{service.description}</p>
                
                {service.beforeImageUrl && service.afterImageUrl && (
                  <BeforeAfterSlider 
                    beforeImage={service.beforeImageUrl} 
                    afterImage={service.afterImageUrl} 
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 px-4 md:px-8 bg-accent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Testimonials</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">Loved by our clients.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviewsData?.map(review => (
              <Card key={review.id} className="border-0 bg-white">
                <CardContent className="p-8">
                  <StarRating value={review.rating} readOnly size="sm" className="mb-4" />
                  <p className="text-gray-700 italic mb-6">"{review.comment}"</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="font-bold text-secondary">{review.customerName}</span>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
            <h4 className="text-2xl font-bold text-secondary mb-2 text-center">Leave a Review</h4>
            <p className="text-gray-500 text-center mb-6">We'd love to hear about your experience.</p>
            
            {reviewSuccess ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="font-bold text-lg">Thank you!</p>
                <p>Your review has been submitted and is pending approval.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex justify-center mb-6">
                  <StarRating 
                    value={reviewForm.rating} 
                    onChange={(val) => setReviewForm({...reviewForm, rating: val})} 
                    size="lg" 
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Your Name" 
                    value={reviewForm.customerName}
                    onChange={(e) => setReviewForm({...reviewForm, customerName: e.target.value})}
                    required
                    className="bg-accent border-0"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Tell us about your experience..." 
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    required
                    className="bg-accent border-0 min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl h-12" disabled={submitReview.isPending}>
                  {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">About Us</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">Committed to excellence.</h3>
            
            <div className="space-y-6 text-lg text-gray-600">
              {about?.introduction && <p>{about.introduction}</p>}
              {about?.mission && (
                <div>
                  <h4 className="font-bold text-secondary text-xl mb-2">Our Mission</h4>
                  <p>{about.mission}</p>
                </div>
              )}
              {about?.vision && (
                <div>
                  <h4 className="font-bold text-secondary text-xl mb-2">Our Vision</h4>
                  <p>{about.vision}</p>
                </div>
              )}
              {about?.experience && (
                <div className="bg-accent p-6 rounded-2xl mt-8">
                  <p className="font-medium text-secondary italic">"{about.experience}"</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <img src="/api/uploads/team1.jpg" alt="Team" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
              <img src="/api/uploads/hero2.jpg" alt="Cleaning" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
            </div>
            <div className="space-y-4">
              <img src="/api/uploads/hero3.jpg" alt="Cleaning" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
              <img src="/api/uploads/team2.jpg" alt="Team" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
            </div>
          </div>
        </div>

        {team && team.length > 0 && (
          <div>
            <h3 className="text-3xl font-extrabold text-secondary mb-12 text-center">Meet Our Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map(member => (
                <div key={member.id} className="group text-center">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 shadow-xl relative">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-accent flex items-center justify-center text-4xl text-primary font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-secondary">{member.name}</h4>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-8 bg-secondary text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Get in Touch</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold mb-6">Ready for a spotless space?</h3>
            <p className="text-white/70 text-lg mb-12">Contact us today to schedule your cleaning service or request a free quote.</p>
            
            <div className="space-y-6">
              {settings?.contactInfo && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Call Us</p>
                    <p className="text-xl font-medium">{settings.contactInfo}</p>
                  </div>
                </div>
              )}
              {settings?.whatsappNumber && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">WhatsApp</p>
                    <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-xl font-medium hover:text-[#25D366] transition-colors">
                      +{settings.whatsappNumber}
                    </a>
                  </div>
                </div>
              )}
              {settings?.businessAddress && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Location</p>
                    <p className="text-lg font-medium max-w-xs">{settings.businessAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Card className="bg-white text-secondary border-0 shadow-2xl">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6">Request a Quote</h4>
              
              {contactSuccess ? (
                <div className="bg-green-50 text-green-700 p-8 rounded-xl text-center h-full flex flex-col items-center justify-center min-h-[300px]">
                  <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
                  <p className="font-bold text-2xl mb-2">Message Sent!</p>
                  <p>We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input 
                    placeholder="Full Name" 
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})}
                    required
                    className="h-12 bg-accent/50 border-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Phone Number" 
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      required
                      className="h-12 bg-accent/50 border-0"
                    />
                    <Input 
                      placeholder="Email Address" 
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      className="h-12 bg-accent/50 border-0"
                    />
                  </div>
                  <select 
                    className="flex h-12 w-full rounded-lg border-0 bg-accent/50 px-4 py-2 text-sm text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={contactForm.serviceRequired}
                    onChange={(e) => setContactForm({...contactForm, serviceRequired: e.target.value})}
                  >
                    <option value="" disabled>Select a Service</option>
                    <option value="House Cleaning">House Cleaning</option>
                    <option value="Office Cleaning">Office Cleaning</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Move In/Out">Move In/Out Cleaning</option>
                    <option value="Other">Other</option>
                  </select>
                  <Textarea 
                    placeholder="Additional Details or Message..." 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="min-h-[120px] bg-accent/50 border-0"
                  />
                  <Button type="submit" className="w-full h-14 text-lg rounded-xl mt-2" disabled={submitContact.isPending}>
                    {submitContact.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white/50 border-t border-white/10 pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName || "CleanPro"} className="h-8 grayscale brightness-200" />
              ) : (
                <div className="text-2xl font-black flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  {settings?.siteName || "CleanPro"}
                </div>
              )}
            </div>
            <p className="max-w-xs mb-6">Premium cleaning services designed to bring comfort, health, and peace of mind to your space.</p>
            <div className="flex items-center gap-4">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-sm font-bold">
                  {link.platform.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {visibleNav.map(item => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-sm flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p>{settings?.footerText || `© ${new Date().getFullYear()} CleanPro. All rights reserved.`}</p>
        </div>
      </footer>
    </div>
  );
}
