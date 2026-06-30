import { Language } from '../types';
import { translations } from '../translations';
import { GraduationCap, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function Footer({ lang, onNavigate }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="bg-gray-900 text-gray-400 font-sans border-t border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Col 1: App Identity */}
          <div className="space-y-4">
            <div
              onClick={() => onNavigate('#/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="bg-primary p-2 rounded-lg text-dark">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-primary transition-colors">
                {t.appName}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              {lang === 'en'
                ? "Empowering Ethiopian students with world-class digital skills and business instruction in English and Afaan Oromoo."
                : "Barattoota Itoophiyaa ogummaa dijitaalaa sadarkaa addunyaa fi barumsa daldalaatiin qopheessuun Afaan Ingilizii fi Oromootiin."}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('#/')} className="hover:text-primary cursor-pointer">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/courses')} className="hover:text-primary cursor-pointer">
                  {t.navCourses}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/about')} className="hover:text-primary cursor-pointer">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/contact')} className="hover:text-primary cursor-pointer">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Courses Portfolio */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">{t.navCourses}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('#/courses')} className="hover:text-primary text-left">
                  Photo Editing Course
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/courses')} className="hover:text-primary text-left">
                  Logo Design Course
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/courses')} className="hover:text-primary text-left">
                  Contact Center Training
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/courses')} className="hover:text-primary text-left">
                  Social Media Management
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Localization */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Harar Office Hub</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Harar, Ethiopia, Kebele 02</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>0967145146</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>dhiirakoo@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <span>&copy; {new Date().getFullYear()} TB-WEBAPP Academy. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Crafted with passion for Ethiopian Students
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </footer>
  );
}
