// Page CSS files
import aboutme from './aboutme.css';
import articles from './articles.css';
import books from './books.css';
import gospel from './gospel.css';
import projects from './projects.css';
import resources from './resources.css';
import viewarticle from './viewarticle.css';

// Component CSS files
import article_module from '../../components/css/article_module.css';
import codesnippet from '../../components/css/codesnippet.css';
import experience_module from '../../components/css/experience_module.css';
import filter_tag from '../../components/css/filter_tag.css';
import footer from '../../components/css/footer.css';
import navbar from '../../components/css/navbar.css';
import pagination from '../../components/css/pagination.css';
import paragraph_module from '../../components/css/paragraph_module.css';
import project_module from '../../components/css/project_module.css';
import testimonial_module from '../../components/css/testimonial_module.css';

// Section CSS files
import about_me from '../../sections/css/about_me.css';
import contact_me from '../../sections/css/contact_me.css';
import experience from '../../sections/css/experience.css';
import favorites_section from '../../sections/css/favorites_section.css';
import gospel_teaser from '../../sections/css/gospel_teaser.css';
import intro from '../../sections/css/intro.css';
import post_subsection from '../../sections/css/post_subsection.css';
import projects_section from '../../sections/css/projects.css';
import testimonial from '../../sections/css/testimonial.css';
import utilities from '../../sections/css/utilities.css';

const cssFiles = {
    // Page styles
    pages: {
        aboutme,
        articles,
        books,
        gospel,
        projects,
        resources,
        viewarticle
    },
    
    // Component styles
    components: {
        article_module,
        codesnippet,
        experience_module,
        filter_tag,
        footer,
        navbar,
        pagination,
        paragraph_module,
        project_module,
        testimonial_module
    },
    
    // Section styles
    sections: {
        about_me,
        contact_me,
        experience,
        favorites_section,
        gospel_teaser,
        intro,
        post_subsection,
        projects: projects_section,
        testimonial,
        utilities
    }
};

export default cssFiles; 