import satori, { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web'
import { lowlight } from 'lowlight/lib/common'

const getYoga = fetch(new URL('../../vendor/yoga.wasm', import.meta.url)).then(
  (r) => r.arrayBuffer()
)

export const config = {
  runtime: 'experimental-edge',
}

const THEME = {
  'hljs-tag': '#f8f8f2',
  'hljs-subst': '#f8f8f2',
  'hljs-strong': '#a8a8a2',
  'hljs-emphasis': '#a8a8a2',
  'hljs-bullet': '#ae81ff',
  'hljs-quote': '#ae81ff',
  'hljs-number': '#ae81ff',
  'hljs-regexp': '#ae81ff',
  'hljs-literal': '#ae81ff',
  'hljs-link': '#ae81ff',
  'hljs-code': '#a6e22e',
  'hljs-title': '#a6e22e',
  'hljs-section': '#a6e22e',
  'hljs-selector-class': '#a6e22e',
  'hljs-keyword': '#f92672',
  'hljs-selector-tag': '#f92672',
  'hljs-name': '#f92672',
  'hljs-attr': '#f92672',
  'hljs-symbol': '#66d9ef',
  'hljs-attribute': '#a6e22e',
  'hljs-params': '#f8f8f2',
  'hljs-string': '#e6db74',
  'hljs-type': '#e6db74',
  'hljs-built_in': '#e6db74',
  'hljs-selector-id': '#e6db74',
  'hljs-selector-attr': '#e6db74',
  'hljs-selector-pseudo': '#e6db74',
  'hljs-addition': '#e6db74',
  'hljs-variable': '#e6db74',
  'hljs-template-variable': '#e6db74',
  'hljs-comment': '#75715e',
}

function LineNumber({ n }) {
  return (
    <span
      style={{
        width: 0.001,
        transform: 'translateX(-32px)',
        opacity: 0.3,
      }}
    >
      {n}
    </span>
  )
}

function transform(node, color, context) {
  switch (node.type) {
    case 'element':
      const className = node.properties?.className
      return node.children.map((el) =>
        transform(el, THEME[className] || color || '#f8f8f2', context)
      )
    case 'text':
      return node.value.split('\n').reduce((acc, line) => {
        const chars = line.split('')
        if (!chars.length) chars.push('')

        return [
          ...acc,
          ...(acc.length
            ? [
                <div
                  style={{
                    width: '100%',
                    height: 1,
                    display: 'flex',
                  }}
                />,
                <LineNumber n={++context.l} />,
              ]
            : []),

          <span
            style={{
              color,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {chars.join('')}
          </span>,
        ]
      }, [])
    default:
      if (node.children) {
        return node.children.map((el) => transform(el, color, context))
      }
  }
  return []
}

export default async function handler(req) {
  try {
    const yogaWasm = await getYoga
    const yoga = await initYoga(yogaWasm)
    init(yoga)

    const font = await fetch(
      new URL('../../vendor/IBMPlexMono-Text.otf', import.meta.url)
    ).then((res) => res.arrayBuffer())

    const { searchParams } = new URL(req.url)

    const code =
      searchParams.get('code') ||
      `const btn = document.getElementById('btn')
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
})`

    const fontSize = parseInt(searchParams.get('fontSize') || '16')
    const background = searchParams.get('background') || 'gold'
    const lang = searchParams.get('lang') || 'js'
    const tree = lowlight.highlight(lang, code)
    const jsx = (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {[<LineNumber n={1} />].concat(
          transform(tree, '#f8f8f2', { l: 1 }).flat(Infinity)
        )}
      </div>
    )

    function Dot() {
      return (
        <span
          style={{
            borderRadius: 20,
            width: 10,
            height: 10,
            marginRight: 6,
            background: '#666',
            display: 'flex',
          }}
        ></span>
      )
    }

    const svg = await satori(
      <div
        style={{
          background,
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'left',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          fontSize,
          lineHeight: 1.4,
        }}
      >
        <div
          style={{
            whiteSpace: 'pre-wrap',
            color: '#f8f8f2',
            background: '#23241f',
            width: '90%',
            height: '85%',
            padding: '16px 20px',
            borderRadius: 15,
            border: '4px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ marginBottom: 8, display: 'flex', width: '100%' }}>
            <Dot />
            <Dot />
            <Dot />
          </div>
          <div
            style={{
              paddingLeft: 32,
              display: 'flex',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {jsx}
          </div>
        </div>
      </div>,
      {
        width: 700,
        height: 450,
        fonts: [
          {
            name: 'IBM Plex Mono',
            data: font,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    })
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate the image: ' + e.message, {
      status: 500,
    })
  }
}
