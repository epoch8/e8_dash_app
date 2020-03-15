import setuptools

setuptools.setup(
    name='e8_dash_app',
    use_scm_version=True,
    packages=[
        'e8_dash_app',
        'e8_dash_app.assets',
        'e8_dash_app.assets.css',
        'e8_dash_app.assets.fonts',
        'e8_dash_app.assets.fonts.RobotoBold',
        'e8_dash_app.assets.fonts.RobotoRegular',
        'e8_dash_app.assets.images',
        'e8_dash_app.assets.js',
    ],
    package_data={
        "": ["*.css", "*.js", "*.png", "*.woff", "*.woff2", "*.ico"]
    }
)