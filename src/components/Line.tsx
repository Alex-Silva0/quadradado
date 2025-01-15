interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function Line({ x1, y1, x2, y2 }: LineProps) {
  const thickness = 14;

  const a = x1 - x2,
    b = y1 - y2,
    length = Math.sqrt(a * a + b * b);

  const sx = (x1 + x2) / 2,
    sy = (y1 + y2) / 2;

  const x = sx - length / 2,
    y = sy;

  const angle = Math.PI - Math.atan2(-b, a);

  const styles: React.CSSProperties = {
    height: `${thickness}`,
    width: `${length + 5}px`,
    transform: `rotate(${angle}rad)`,
    top: `${y - thickness / 2}px`,
    left: `${x}px`,
  };

  return <div className="line" style={styles}></div>;
}
