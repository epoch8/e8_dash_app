from jinja2 import Environment, BaseLoader
import dash
import flask
import pathlib

TITLE = 'Epoch8 – Outsourcing for Machine Learning and Data Analytics projects'

NAV_LINKS = [
    {
        'url': 'https://www.epoch8.co/',
        'label': 'Machine Learning'
    },
    {
        'url': 'https://www.epoch8.co/ekibana',
        'label': 'Analytics'
    },
    {
        'url': 'https://www.epoch8.co/ecom',
        'label': 'Ecommerce solutions'
    }
]

FORM_VALUE = 'c12n'
FORM_ACTION = 'https://hooks.zapier.com/hooks/catch/2813553/ooavct8/'

nav_list = '''
    <ul class="main-nav__list">
        {% for navLink in navLinks %}
        <li class="main-nav__item">
            <a class="main-nav__link" href="{{ navLink.url }}">{{ navLink.label }}</a>
        </li>
        {% endfor %}
    </ul>
'''

URL_PREFIX = '/e8-dash-app/'

STATIC_DIR = pathlib.Path(__file__).parent / 'assets'

CSS_FILES = [
    '/e8-dash-app/css/normalize.css',
    '/e8-dash-app/css/style.css',
    '/e8-dash-app/css/epoch8.css',
]

JS_FILES = [
    '/e8-dash-app/js/jquery.min.js',
    '/e8-dash-app/js/script.js',
]

CONTACT_BUTTON = '''
    <div class="header__actions">
        <a href="#feedback" class="button header__actions-btn">Contact us</a>
    </div>
'''

INDEX_TEMPLATE = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>{TITLE}</title>
            {{%favicon%}}
            {{%css%}}
        </head>
        <body>
            <header class="header" id="header">
                <div class="header__inner">
                    <div class="header__container-wrapper">
                        <div class="header__container">
                            <a class="logo header__logo" href="https://www.epoch8.co/">
                                <picture>
                                    <img class="" src="/e8-dash-app/images/favicon-256x256.png" width="48" height="48" alt="Epoch8.co" title="1">
                                </picture>
                            </a>
                            <a class="header__additional-logo" href="#header">
                                <span>E</span>poch 8
                            </a>
                            <button class="header__toggle" type="button"><span></span></button>
                        </div>
                    </div>
                    <nav class="header__nav main-nav">
                        {NAV_LIST}
                        {CONTACT_BUTTON}
                    </nav>
                </div>
            </header>
            <section class="align-items-start">
                <div class="container">
                    {{%app_entry%}}
                </div>
            </section>
            <!-- feedback goes here -->
            <footer>
                {{%config%}}
                {{%scripts%}}
                {{%renderer%}}
            </footer>
        </body>
    </html>
'''

FEEDBACK_FORM = '''
            <section class="section" id="feedback">
                <div class="container">
                    <h2 class="title">Request a design brief or ask a question</h2>
                    <div class="contact-form">
                        <form action="''' + FORM_ACTION + '''">
                            <input type="hidden" name="form" value="'''+ FORM_VALUE +'''">
                            <label class="field-label" for="form-name">Your name: <span class="field-label__required">[required]</span></label>
                            <input type="text" class="input" maxlength="256" name="name" placeholder="Name" id="form-name" pattern="[a-zA-Zа-яА-Я ]+" required>
                            <label class="field-label" for="form-phone">Your phone number:</label>
                            <input class="input" type="text" maxlength="256" name="phone" placeholder="+" id="form-phone">
                            <label class="field-label" for="form-email">Your e-mail: <span class="field-label__required">[required]</span></label>
                            <input class="input" type="email" maxlength="256" name="email" placeholder="hello@epoch8.co" id="form-email" required>
                            <label class="field-label" for="form-message">Your message: <span class="field-label__required">[required]</span></label>
                            <textarea class="input textarea" maxlength="5000" name="message" id="form-message" required></textarea>
                            <button class="button" type="submit">Submit</button>
                        </form>
                        <div class="contact-form__message contact-form__message--success contact-form__message--hidden">Thank you! Your submission has been received!</div>
                        <div class="contact-form__message contact-form__message--error contact-form__message--hidden">Oops! Something went wrong while submitting the form.</div>
                    </div>
                </div>
            </section>
'''

class E8Dash(dash.Dash):
    def __init__(
            self, 
            name, 
            e8_nav_links=NAV_LINKS,
            e8_contact_us_button=True,
            external_stylesheets=[], 
            external_scripts=[], 
            *args, **kwargs
        ):
        dash.Dash.__init__(self, 
            name=name,
            external_stylesheets=external_stylesheets + [i for i in CSS_FILES], 
            external_scripts=external_scripts + [i for i in JS_FILES],
            *args, **kwargs
        )

        @self.server.route('/e8-dash-app/<path:path>')
        def serve_static(path):
            return flask.send_from_directory(STATIC_DIR, path)

        nav_list_template = Environment(loader=BaseLoader).from_string(nav_list)
        template_vars = {"navLinks": e8_nav_links}
        nav_list_template_out = nav_list_template.render(template_vars)

        self.index_string = INDEX_TEMPLATE.format(
            TITLE=TITLE,
            NAV_LIST=nav_list_template_out,
            CONTACT_BUTTON=CONTACT_BUTTON if e8_contact_us_button else ''
        )