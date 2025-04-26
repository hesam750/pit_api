"use client";

import { useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { swaggerConfig } from "@/config/swagger";

export default function APIDocs() {
  useEffect(() => {
    // Add custom styles
    const style = document.createElement("style");
    style.textContent = `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .wrapper { padding: 0 20px; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Documentation
        </h1>
        <div className="bg-white rounded-lg shadow">
          <SwaggerUI spec={swaggerConfig} />
        </div>
      </div>
    </div>
  );
} 