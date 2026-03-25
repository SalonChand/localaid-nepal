import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        dashboard: "Dashboard",
        ngos: "NGO Directory",
        events: "Events",
        tasks: "Task Board",
        myTasks: "My Tasks",
        admin: "Admin Panel",
        signIn: "Sign In",
        createAccount: "Create Account",
        signOut: "Sign Out"
      }
    }
  },
  ne: {
    translation: {
      header: {
        dashboard: "ड्यासबोर्ड",
        ngos: "संस्थाहरू",
        events: "कार्यक्रमहरू",
        tasks: "कार्य पाटी",
        myTasks: "मेरा कार्यहरू",
        admin: "प्रशासक प्यानल",
        signIn: "लग इन",
        createAccount: "खाता खोल्नुहोस्",
        signOut: "लग आउट"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;