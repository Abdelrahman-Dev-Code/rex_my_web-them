import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070B",
          borderRadius: 40,
          border: "4px solid rgba(124, 92, 255, 0.45)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
          <path
            d="M25 22L15 32L25 42"
            stroke="#7C5CFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M39 22L49 32L39 42"
            stroke="#4FE3C1"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 19L30 45"
            stroke="#F4F4F6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
