import { useEffect, useRef } from 'react'

/*
  Full-screen image that slowly "glides" like water: the texture is sampled
  through a moving, layered sine-flow distortion in a tiny WebGL shader.
  mode 0 = original colours, mode 1 = remap to a purple/black palette.
  Falls back to a plain CSS background if WebGL is unavailable.
*/
const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; v.y = 1.0-v.y; gl_Position = vec4(p,0.,1.); }`
const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D img;
uniform float t, strength, mode;
uniform vec2 scale, shift;
vec2 flow(vec2 q, float t){
  return vec2(
    sin(q.y*2.3 + t*0.9) + 0.6*sin(q.y*4.1 - t*1.2 + q.x*1.7) + 0.3*sin(q.x*6.3 + t*0.7),
    cos(q.x*2.0 - t*0.8) + 0.6*sin(q.x*3.6 + t*1.05 + q.y*1.3) + 0.3*cos(q.y*5.7 - t*0.6)
  );
}
void main(){
  vec2 uv = v*scale + shift;
  vec2 q = uv*3.0;
  vec2 o = flow(q, t);
  o += 0.5*flow(q*1.7 + o*0.4, t*1.3);
  uv += o*strength + vec2(t*0.004, t*0.002);
  uv = abs(mod(uv + 1.0, 2.0) - 1.0); // mirror-repeat so edges never show
  vec3 c = texture2D(img, uv).rgb;
  if (mode > 0.5) {
    float l = dot(c, vec3(0.299,0.587,0.114));
    l = smoothstep(0.25, 0.75, l);
    vec3 a = vec3(0.025,0.01,0.04), b = vec3(0.24,0.07,0.36), d = vec3(0.62,0.38,0.82);
    c = l < 0.55 ? mix(a, b, l/0.55) : mix(b, d, (l-0.55)/0.45);
  }
  gl_FragColor = vec4(c, 1.0);
}`

export default function FlowBackground({ src, strength = 0.012, speed = 0.35, mode = 0, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) {
      canvas.style.background = `url(${src}) center/cover`
      return
    }
    const sh = (type, code) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, code)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n) => gl.getUniformLocation(prog, n)

    let raf
    let imgW = 1
    let imgH = 1
    let ready = false
    const tex = gl.createTexture()
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgW = img.width
      imgH = img.height
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      ready = true
    }
    img.src = src

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    const draw = (now) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      if (ready) {
        gl.viewport(0, 0, w, h)
        // "cover" fit, slightly zoomed in so the distortion has room
        const ca = w / h
        const ia = imgW / imgH
        let sx = 0.92
        let sy = 0.92
        if (ca > ia) sy *= ia / ca
        else sx *= ca / ia
        gl.uniform2f(U('scale'), sx, sy)
        gl.uniform2f(U('shift'), (1 - sx) / 2, (1 - sy) / 2)
        gl.uniform1f(U('t'), reduce ? 0 : ((now - start) / 1000) * speed)
        gl.uniform1f(U('strength'), strength)
        gl.uniform1f(U('mode'), mode)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [src, strength, speed, mode])

  return <canvas ref={ref} className={`flow-bg ${className}`} aria-hidden="true" />
}
