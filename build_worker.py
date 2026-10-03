import json
import os

with open('index.html', 'r') as f:
    index_html = f.read()

with open('history.html', 'r') as f:
    history_html = f.read()

worker_code = f"""
const indexHtml = {json.dumps(index_html)};
const historyHtml = {json.dumps(history_html)};

export default {{
  async fetch(request, env, ctx) {{
    const url = new URL(request.url);
    if (url.pathname === '/history' || url.pathname === '/history.html') {{
      return new Response(historyHtml, {{ headers: {{ 'Content-Type': 'text/html;charset=UTF-8' }} }});
    }}
    return new Response(indexHtml, {{ headers: {{ 'Content-Type': 'text/html;charset=UTF-8' }} }});
  }}
}};
"""

with open('worker.js', 'w') as f:
    f.write(worker_code)

with open('wrangler.toml', 'w') as f:
    f.write('name = "cortex-band-website"\\n')
    f.write('main = "worker.js"\\n')
    f.write('compatibility_date = "2024-03-20"\\n')
