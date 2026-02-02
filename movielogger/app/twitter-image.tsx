import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Trackd - Track Your Movies & Shows";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FF5924",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Logo */}
          <img
            src="https://movie-logger-two.vercel.app/logo_light.png"
            width="160"
            height="160"
            style={{
              width: "160px",
              height: "160px",
            }}
          />
          {/* Text */}
          <span
            style={{
              fontSize: "110px",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Trackd
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
