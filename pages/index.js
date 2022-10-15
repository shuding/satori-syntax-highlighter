import { useState } from 'react'
import Head from 'next/head'

export default function Playground() {
  const [code, setCode] = useState(`const btn = document.getElementById('btn')
let count = 0
function render() {
  btn.innerText = \`Count: \${count}\`
}
btn.addEventListener('click', () => {
  // Count from 1 to 10.
  if (count < 10) {
    count += 1
    render()
  }
})`)
  const [background, setBackground] = useState('#FFD700')
  const [lang, setLang] = useState('js')
  const [fontSize, setFontSize] = useState(16)

  const url =
    '/api/highlighter?code=' +
    encodeURIComponent(code) +
    '&background=' +
    encodeURIComponent(background) +
    '&lang=' +
    lang +
    '&fontSize=' +
    fontSize

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem 1rem 4rem',
      }}
    >
      <Head>
        <title>Satori Syntax Highlighter</title>
        <meta name='description' content='Satori Syntax Highlighter' />
        <meta name='og:title' content='Satori Syntax Highlighter' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='og:image'
          content='https://satori-syntax-highlighter.vercel.app/og.png'
        />
        <meta
          name='twitter:image'
          content='https://satori-syntax-highlighter.vercel.app/og.png'
        />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI,
            Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
            Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
          font-smoothing: antialiased;
          color: #111;
          background: #f5f6f7;
          letter-spacing: -0.01em;
        }
        h1 {
          font-size: 2.5rem;
        }
        p {
          margin-top: 0;
        }
        a {
          color: inherit;
          text-underline-position: from-font;
        }
      `}</style>

      <h1>Satori Syntax Highlighter</h1>
      <p>
        Syntax highlighting and image rendering on Vercel’s{' '}
        <a href='https://vercel.com/features/edge-functions' target='_blank'>
          Edge Server
        </a>
        .
      </p>
      <p>
        Powered by{' '}
        <a
          href='https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images'
          target='_blank'
        >
          Vercel Image Generation
        </a>
        {' and '}
        <a href='https://github.com/wooorm/lowlight' target='_blank'>
          Lowlight
        </a>
        .
      </p>
      <img src={url} style={{ maxWidth: '100%', width: 700 }} />
      <div style={{ margin: '10px 0 20px', display: 'flex', gap: '2rem' }}>
        <a
          href='https://github.com/shuding/satori-syntax-highlighter'
          target='_blank'
        >
          GitHub Repo
        </a>
        <a href={url} target='_blank'>
          Open Image ↗️
        </a>
      </div>
      <div style={{ margin: '10px 0' }}>
        <label style={{ marginRight: 10 }}>
          Background&nbsp;
          <input
            type='color'
            onChange={(e) => setBackground(e.target.value)}
            value={background}
          />
        </label>
        <label style={{ marginRight: 10 }}>
          Language&nbsp;
          <select onChange={(e) => setLang(e.target.value)} value={lang}>
            <option value='js'>JavaScript</option>
            <option value='css'>CSS</option>
            <option value='typescript'>TypeScript</option>
            <option value='xml'>HTML</option>
          </select>
        </label>
        <label style={{ marginRight: 10 }}>
          Font Size&nbsp;
          <input
            type='range'
            min='10'
            max='20'
            step='1'
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
          {fontSize}px
        </label>
      </div>
      <textarea
        rows={16}
        spellCheck={false}
        style={{
          resize: 'none',
          fontSize: 16,
          whiteSpace: 'pre-wrap',
          maxWidth: '100%',
          width: 700,
          margin: 0,
          padding: 10,
          boxSizing: 'border-box',
          fontFamily:
            "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Consolas, monospace",
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
    </div>
  )
}
