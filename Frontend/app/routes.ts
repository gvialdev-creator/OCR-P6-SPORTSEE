import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public route
  index("routes/home.tsx"),

  // Protected routes layout
  route("", "routes/protected.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    // Add more protected routes here as needed
    // route("settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
