import e8_dash_app
import dash_core_components as dcc
import dash_html_components as html

app = e8_dash_app.E8Dash()

app.layout = dcc.Markdown('Hello world!')

app.run_server(port=8080, host='0.0.0.0')