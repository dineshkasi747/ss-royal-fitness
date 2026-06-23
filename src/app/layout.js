import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Progym – Personal Trainers & Fitness",
  description: "Creating custom workout plans tailored to your unique needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Global Stylesheets */}
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Widgets/assets/css/headerinfoa7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Widgets/assets/css/navmenua7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Widgets/assets/css/offcanvasa7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Widgets/assets/css/searcha7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Widgets/assets/css/site_logoa7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/template-kit-export/assets/public/template-kit-export-public982a.css?ver=1.0.23" />
        <link rel="stylesheet" href="/wp-content/themes/hello-elementor/assets/css/reset08cb.css?ver=3.4.9" />
        <link rel="stylesheet" href="/wp-content/themes/hello-elementor/assets/css/theme08cb.css?ver=3.4.9" />
        <link rel="stylesheet" href="/wp-content/themes/hello-elementor/assets/css/header-footer08cb.css?ver=3.4.9" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/frontend.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/uploads/sites/57/elementor/css/post-65a9c.css?ver=1772026806" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.minc98d.css?ver=5.49.0" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/assets/css/animate.mina7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/assets/css/panel_systema7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Extensions/assets/css/BlurEffectsa7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Extensions/assets/css/WrapperLinka7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Extensions/assets/css/tooltipa7f4.css?ver=2.0.8" />
        
        {/* Core Elementor Styles */}
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-divider.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-heading.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/advanced_headinga7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-social-icons.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-video.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/countera7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/lib/odometer.mina7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-icon-box.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-icon-list.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/animated_headinga7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/card_slidera7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/lib/swiper.mina7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/teama7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min94a4.css?ver=8.4.5" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/conditionals/e-swiper.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-image-carousel.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/testimonial_carousela7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/widget-image.mina352.css?ver=4.1.3" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/post-grida7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/post-blocka7f4.css?ver=2.0.8" />
        
        {/* Rometheme Custom Icons */}
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/assets/css/rtmicon-thina7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/assets/css/rtmicon-regulara7f4.css?ver=2.0.8" />
        <link rel="stylesheet" href="/wp-content/plugins/rometheme-for-elementor/Inc/Elements/assets/css/social_icona7f4.css?ver=2.0.8" />

        {/* Global Layout Styles */}
        <link rel="stylesheet" href="/wp-content/uploads/sites/57/elementor/css/post-219fceb.css?ver=1772441829" />
        <link rel="stylesheet" href="/wp-content/uploads/sites/57/elementor/css/post-220af2e.css?ver=1772442023" />
        
        {/* Fonts */}
        <link rel="stylesheet" href="/wp-content/uploads/sites/57/elementor/google-fonts/css/montserrat9dbd.css?ver=1747983937" />
        <link rel="stylesheet" href="/wp-content/uploads/sites/57/elementor/google-fonts/css/pontanosans9dbd.css?ver=1747983937" />

        <link rel="icon" href="/wp-content/uploads/sites/57/2025/05/Progym-Fav-Icon.png" sizes="32x32" />
      </head>
      <body className="home wp-singular page-template-default page page-id-2 wp-custom-logo wp-embed-responsive wp-theme-hello-elementor hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-2">
        <div id="page">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
