# Rajesh Roshan Nanda — Professional Portfolio V4

A static, responsive, no-build portfolio presenting AI/LLM engineering, Python automation, independent programming case studies, a browser-sandbox virtual OS, polygon mathematics and design experiments, and direct contact actions.

## Open locally
Open `index.html` directly, or run `python -m http.server 8000` in this directory and open `http://localhost:8000/`. Browsers usually require localhost or HTTPS for microphone access. Voice recognition also depends on the browser and may use third-party services.

## Contact
Email: rajeshroshannanda2@gmail.com | Phone / WhatsApp: +91 9178839312 | LinkedIn: https://www.linkedin.com/in/rajesh-nanda-000033390/ | GitHub: https://github.com/himanshu77raj.

## What's in this package
- `index.html`: the semantic page and original SVG diagrams
- `styles.css`: responsive design, typography, accessibility and print styles
- `script.js`: virtual OS, case studies, portfolio assistant, canvas geometry and interactivity
- `worker/`: Cloudflare Worker for hosted Llama answers and Mira's spoken replies
- `assets/favicon.svg`: favicon
- `assets/rajesh-roshan-nanda-portrait.webp`: optimized original user-supplied portrait
- `assets/rajesh-roshan-nanda-original.png`: unedited user-supplied photograph
- `MASTER-PROMPT.md`: a detailed prompt for expanding and quality-checking this portfolio
- `TEST-REPORT.md`: V4 validation and browser-testing limitations

## Important boundaries
This site is not a connection to Rajesh's desktop, real private APIs, or local source files. API responses, terminal commands, and sample workflow inputs are sandbox demonstrations. The chatbot answers English portfolio questions from curated public facts and sends open questions and selected-language replies to Llama through Cloudflare Workers AI. English spoken replies use Cloudflare's Aura 2 voice when available. Other languages use browser speech synthesis and require a matching installed browser/system voice; text answers remain available when no voice is present. The language selector also sets the microphone recognition locale where the browser supports it. No private credentials or proprietary code are embedded in the page. Project-specific GitHub repositories have not been verified as public. This portfolio is published through GitHub Pages.

## Deployment
The public source repository is [himanshu77raj.github.io](https://github.com/himanshu77raj/himanshu77raj.github.io). GitHub Pages serves the site at [https://himanshu77raj.github.io/](https://himanshu77raj.github.io/). The GitHub Pages source is the root of the `main` branch.

Only the optimized portrait is published. The unedited original photograph, working prompt, and local test report remain outside the repository through `.gitignore`. The engineering projects described on the page are separate private or demonstrative work; their source code is not published here.

## Assistant backend

From `worker/`, sign in with `npx wrangler login`, then deploy with `npx wrangler deploy`. Wrangler will print the `*.workers.dev` URL. Set `ASSISTANT_API` in `script.js` to that URL, then publish the static site through GitHub Pages. The Worker uses Cloudflare AI bindings, so there is no Llama or speech API key in the repository. Both endpoints accept requests only from this site's origin, limit request sizes and output length, and use per-visitor and site request limits. Cloudflare's Workers AI usage allowance and billing settings remain under the Cloudflare account owner’s control.
