/*
 * Session refresh tests for the admin API client.
 * Run (no extra dependency in this repo):
 *   node ../../magaritatech-react-ecommerce/node_modules/vitest/vitest.mjs run --root . --globals --environment node src/services/axiosInstance.test.mjs
 */
import { AxiosError } from "axios";

// Fake backend + cookie jar; refresh rotates like the backend (old token kept for graceMs)
const makeBackend = ({ graceMs = 30000, refreshFailure = null, alwaysUnauthorized = [] } = {}) => {
  let n = 0;
  const backend = {
    tokens: new Map([["r0", Infinity]]),
    jar: { access: null, refresh: "r0" },
    refreshCalls: 0,
    requests: [],
  };
  backend.adapter = (config) =>
    new Promise((resolve, reject) => {
      const sent = { ...backend.jar };
      backend.requests.push(config.url);
      setTimeout(() => {
        const reply = (status, data = {}) => {
          const response = { status, data, headers: {}, config };
          if (status >= 200 && status < 300) resolve(response);
          else reject(new AxiosError(`HTTP ${status}`, String(status), config, null, response));
        };
        if (config.url === "/refresh-token") {
          backend.refreshCalls += 1;
          if (refreshFailure === "network") return reject(new AxiosError("Network Error", "ERR_NETWORK", config));
          if (refreshFailure === 500) return reply(500, { code: "REFRESH_SERVER_ERROR" });
          if (!sent.refresh) return reply(401, { code: "REFRESH_MISSING" });
          const validUntil = backend.tokens.get(sent.refresh);
          if (!validUntil || validUntil < Date.now()) return reply(401, { code: "REFRESH_EXPIRED" });
          backend.tokens.set(sent.refresh, Math.min(validUntil, Date.now() + graceMs));
          backend.jar.refresh = `r${++n}`;
          backend.tokens.set(backend.jar.refresh, Infinity);
          backend.jar.access = `a${n}`;
          return reply(200);
        }
        if (config.url === "/login") return reply(401, { message: "Invalid credentials" });
        if (!sent.access || alwaysUnauthorized.includes(config.url)) return reply(401, { code: "AUTH_TOKEN_EXPIRED" });
        return reply(200, { url: config.url });
      }, 10);
    });
  return backend;
};

let location;

const openTab = async (backend) => {
  vi.resetModules();
  const mod = await import("./axiosInstance");
  mod.default.defaults.adapter = backend.adapter;
  return mod.default;
};

beforeEach(() => {
  location = { pathname: "/orders", assign: vi.fn() };
  vi.stubGlobal("window", { location });
  vi.stubGlobal("localStorage", { removeItem: vi.fn(), getItem: vi.fn(), setItem: vi.fn() });
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => vi.unstubAllGlobals());

describe("admin session refresh", () => {
  test("access token expiry: refresh once, then the request succeeds", async () => {
    const backend = makeBackend();
    const api = await openTab(backend);

    const res = await api.get("/auth/me");

    expect(res.data.url).toBe("/auth/me");
    expect(backend.refreshCalls).toBe(1);
    expect(location.assign).not.toHaveBeenCalled();
  });

  test("dashboard: simultaneous 401s share ONE refresh (was: one refresh each, losers logged out)", async () => {
    const backend = makeBackend({ graceMs: 0 }); // even against the old delete-on-rotate backend
    const api = await openTab(backend);

    const results = await Promise.all(["/auth/me", "/orders", "/products", "/returns"].map((u) => api.get(u)));

    expect(results.map((r) => r.status)).toEqual([200, 200, 200, 200]);
    expect(backend.refreshCalls).toBe(1);
    expect(location.assign).not.toHaveBeenCalled();
  });

  test("refused refresh: one redirect with the reason, all waiting requests rejected", async () => {
    const backend = makeBackend();
    backend.jar.refresh = "revoked";
    const api = await openTab(backend);

    const results = await Promise.allSettled([api.get("/auth/me"), api.get("/orders"), api.get("/products")]);

    expect(results.every((r) => r.status === "rejected" && r.reason.sessionExpired)).toBe(true);
    expect(backend.refreshCalls).toBe(1);
    expect(location.assign).toHaveBeenCalledTimes(1);
    expect(location.assign).toHaveBeenCalledWith("/signin?reason=session_expired");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  test("missing refresh cookie is treated as an expired session", async () => {
    const backend = makeBackend();
    backend.jar.refresh = null;
    const api = await openTab(backend);

    await expect(api.get("/orders")).rejects.toMatchObject({ sessionExpired: true });
    expect(location.assign).toHaveBeenCalledWith("/signin?reason=session_expired");
  });

  test.each([
    ["server error (500)", 500],
    ["network error", "network"],
  ])("refresh hits a temporary %s: no sign-out, request fails visibly", async (_label, failure) => {
    const backend = makeBackend({ refreshFailure: failure });
    const api = await openTab(backend);

    const error = await api.get("/orders").catch((e) => e);

    expect(error.refreshFailedTemporarily).toBe(true);
    expect(location.assign).not.toHaveBeenCalled();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  test("no retry loop: a request that keeps answering 401 is retried once", async () => {
    const backend = makeBackend({ alwaysUnauthorized: ["/orders"] });
    const api = await openTab(backend);

    await expect(api.get("/orders")).rejects.toMatchObject({ response: { status: 401 } });
    expect(backend.refreshCalls).toBe(1);
    expect(backend.requests.filter((u) => u === "/orders")).toHaveLength(2);
  });

  test("login / skipAuthRefresh requests never trigger a refresh", async () => {
    const backend = makeBackend();
    const api = await openTab(backend);

    await expect(api.post("/login", {}, { skipAuthRefresh: true })).rejects.toMatchObject({ response: { status: 401 } });
    await expect(api.post("/login", {})).rejects.toMatchObject({ response: { status: 401 } });
    expect(backend.refreshCalls).toBe(0);
  });

  test("already on /signin: no redirect loop", async () => {
    location.pathname = "/signin";
    const backend = makeBackend();
    backend.jar.refresh = "revoked";
    const api = await openTab(backend);

    await api.get("/auth/me").catch(() => {});
    expect(location.assign).not.toHaveBeenCalled();
  });
});
