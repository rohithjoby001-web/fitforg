// fitforg logo — uses the brand's actual faceted "F" mark.
// The image is solid white on solid black, which blends seamlessly
// with the app's pure-black background (no border needed).
// Image source: /public/fitforg-logo.png  (1254x1254 RGBA PNG)

export function FitforgLogo({
  className = '',
  size = 32,
}: {
  className?: string
  size?: number
}) {
  return (
    <img
      src="/fitforg-logo.png"
      alt="fitforg logo"
      width={size}
      height={size}
      // Square aspect ratio + crisp rendering for high-res source
      className={`block object-contain ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        // Avoid blurriness on the high-res PNG
        imageRendering: 'auto',
      }}
      draggable={false}
    />
  )
}
