import Image from "next/image";

type LogoProps = {
  /** Height in pixels for the brand mark tile */
  size?: number;
  className?: string;
  /**
   * mark - brand blue square with white FBC (source logo; best for nav/favicon contexts)
   * wordmark - white SVG letterforms on transparent (dark backgrounds)
   */
  variant?: "mark" | "wordmark";
  priority?: boolean;
};

export function Logo({
  size = 36,
  className = "",
  variant = "mark",
  priority = false,
}: LogoProps) {
  if (variant === "wordmark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.svg"
        alt="FBC"
        width={Math.round(size * 2.4)}
        height={size}
        className={className}
        style={{ height: size, width: "auto" }}
      />
    );
  }

  return (
    <Image
      src="/logo-source.jpg"
      alt="FBC"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-btn object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
