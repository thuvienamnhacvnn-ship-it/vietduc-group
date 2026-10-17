"use client";

import { useEffect, useRef } from "react";
import styles from "./Logo3D.module.css";

/**
 * Logo Việt Đức 3D nền trong suốt, lặp vô hạn. Chuyển từ `logo-3d.js` (phiên
 * tuxee-4e) sang component để chạy được trong React.
 *
 * Chrome / Edge / Firefox / Android: phát thẳng `.webm` VP9 có alpha.
 * Safari và mọi trình duyệt trên iPhone, iPad (WebKit không đọc alpha của
 * WebM): phát `-ios.mp4` xếp chồng (nửa trên màu, nửa dưới alpha) rồi ghép lại
 * trên canvas WebGL. Không có WebGL, hoặc người xem chọn giảm chuyển động: giữ
 * ảnh tĩnh `-poster.png`.
 */

const SRC = "/brand/3d/vietduc-logo";
const W = 920;
const H = 860;

const isWebKit = () => {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  return /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS|Android/.test(ua);
};

function makeVideo(src: string) {
  const v = document.createElement("video");
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.autoplay = true;
  v.playsInline = true;
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.preload = "auto";
  v.src = src;
  return v;
}

function play(v: HTMLVideoElement, cleanups: Array<() => void>) {
  const p = v.play();
  if (p && p.catch) {
    p.catch(() => {
      // Chế độ tiết kiệm pin chặn tự phát: chờ lần chạm đầu tiên.
      const resume = () => {
        void v.play();
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("click", resume);
      };
      document.addEventListener("touchstart", resume, { passive: true });
      document.addEventListener("click", resume);
      cleanups.push(() => {
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("click", resume);
      });
    });
  }
}

type Props = {
  /** Class của khung ngoài; chiều rộng khung lấy theo CSS. */
  className?: string;
};

export function Logo3D({ className }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];
    let stopped = false;
    const poster = `${SRC}-poster.png`;

    if (!isWebKit()) {
      const v = makeVideo(`${SRC}.webm`);
      v.poster = poster;
      v.className = styles.media;
      // Chỉ thay ảnh tĩnh bằng video khi nó thật sự chạy, nên người xem
      // không bao giờ thấy khung trống.
      v.addEventListener("playing", () => el.classList.add(styles.live), { once: true });
      el.appendChild(v);
      play(v, cleanups);
      cleanups.push(() => {
        v.pause();
        v.removeAttribute("src");
        v.load();
        v.remove();
      });
      return () => cleanups.forEach((fn) => fn());
    }

    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    cv.className = styles.media;
    const gl = cv.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) return;
    el.appendChild(cv);

    const vs =
      "attribute vec2 p;varying vec2 t;void main(){t=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
    const fs =
      "precision mediump float;uniform sampler2D s;varying vec2 t;" +
      "void main(){vec3 c=texture2D(s,vec2(t.x,t.y*.5)).rgb;float a=texture2D(s,vec2(t.x,.5+t.y*.5)).r;gl_FragColor=vec4(c,a);}";
    const shader = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tx = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const v = makeVideo(`${SRC}-ios.mp4`);
    // iOS chỉ giải mã khi video nằm trong trang, nhưng không cần hiện ra.
    v.className = styles.hidden;
    el.appendChild(v);

    let drawn = false;
    const draw = () => {
      if (stopped) return;
      if (v.readyState >= 2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (!drawn) {
          drawn = true;
          el.classList.add(styles.live);
        }
      }
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(draw);
      else requestAnimationFrame(draw);
    };
    if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(draw);
    else requestAnimationFrame(draw);
    play(v, cleanups);

    return () => {
      stopped = true;
      cleanups.forEach((fn) => fn());
      v.pause();
      v.removeAttribute("src");
      v.load();
      v.remove();
      cv.remove();
    };
  }, []);

  return (
    <div
      ref={frame}
      className={`${styles.frame} ${className ?? ""}`}
      role="img"
      aria-label="Việt Đức Group"
    />
  );
}
