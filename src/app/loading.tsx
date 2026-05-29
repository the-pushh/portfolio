export default function Loading() {
  return (
    <>
      <style>{`
        .ld-wrap {
          position: fixed;
          inset: 0;
          background: #141414;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          z-index: 9999;
        }

        /* 13×13 pixel cat face — think expression */
        .ld-face {
          display: grid;
          grid-template-columns: repeat(13, 7px);
          grid-template-rows: repeat(13, 7px);
          gap: 1.5px;
        }
        .ld-px {
          border-radius: 1px;
          background: #feacd6;
          animation: ld-pulse 2s ease-in-out infinite;
        }
        .ld-px-off { background: transparent; }

        @keyframes ld-pulse {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 0.45; }
        }

        .ld-term {
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ld-prompt { color: #feacd6; }
        .ld-dots span {
          display: inline-block;
          animation: ld-dot 1.2s ease-in-out infinite;
          opacity: 0;
        }
        .ld-dots span:nth-child(2) { animation-delay: 0.2s; }
        .ld-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ld-dot {
          0%, 80%, 100% { opacity: 0; }
          40%            { opacity: 1; }
        }
      `}</style>
      <div className="ld-wrap">
        <PixelFace />
        <div className="ld-term">
          <span className="ld-prompt">›</span>
          <span>loading portfolio</span>
          <span className="ld-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>
    </>
  );
}

/* Pre-rendered "think" face pixel grid — 13 cols × 13 rows */
function PixelFace() {
  // 1 = filled, 0 = empty — built from PixelCat BLOB + think expression
  const rows = [
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,0,0,0,1,0], // raised right brow cut at 9,10,11 (cols 8-10 in 0-idx)
    [1,1,0,0,0,1,1,1,1,1,1,1,1], // left eye cut at 3,4,5 (cols 2-4)
    [1,1,0,0,0,1,1,1,0,0,0,1,1], // both eyes
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0,0,1,1,1,1], // mouth top row: cut 8,9 (cols 7-8)
    [1,1,1,1,0,0,0,0,1,1,1,1,1], // mouth bottom: cut 5,6,7,8 (cols 4-7)
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
  ];

  return (
    <div className="ld-face">
      {rows.map((row, r) =>
        row.map((cell, c) => (
          <div key={`${r}-${c}`} className={cell ? "ld-px" : "ld-px-off"} />
        ))
      )}
    </div>
  );
}
