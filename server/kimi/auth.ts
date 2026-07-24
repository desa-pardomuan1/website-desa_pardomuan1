import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as cookie from "cookie";
import { env } from "../lib/env.js";
import { getSessionCookieOptions } from "../lib/cookies.js";
import { Session } from "../../contracts/constants.js";
import { Errors } from "../../contracts/errors.js";
import { signSessionToken, verifySessionToken } from "./session.js";
import { findUserByUnionId, upsertUser } from "../queries/users.js";

export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");

  console.log("[AUTH] Cookies:", cookies);

  const token = cookies[Session.cookieName];

  if (!token) {
    console.warn("[AUTH] No session cookie found");
    throw Errors.forbidden("Invalid authentication token.");
  }

  console.log("[AUTH] Token ditemukan");

  const claim = await verifySessionToken(token);

  console.log("[AUTH] Claim:", claim);

  if (!claim) {
    console.warn("[AUTH] JWT tidak valid");
    throw Errors.forbidden("Invalid authentication token.");
  }

  const user = await findUserByUnionId(claim.unionId);

  console.log("[AUTH] User:", user);

  if (!user) {
    console.warn("[AUTH] User tidak ditemukan");
    throw Errors.forbidden("User not found. Please re-login.");
  }

  console.log("[AUTH] Auth berhasil");

  return user;
}

export function createLoginHandler() {
  return async (c: Context) => {
    const body = await c.req.json().catch(() => null);

    console.log("[LOGIN] Request:", body);

    if (
      !body ||
      typeof body.username !== "string" ||
      typeof body.password !== "string"
    ) {
      return c.json({ error: "username and password are required" }, 400);
    }

    const isValid =
      body.username === env.adminUsername &&
      body.password === env.adminPassword;

    console.log("[LOGIN] Username:", body.username);
    console.log("[LOGIN] Valid:", isValid);

    if (!isValid) {
      return c.json({ error: "Invalid username or password" }, 401);
    }

    const unionId = `local:${body.username}`;

    await upsertUser({
      unionId,
      name: body.username,
      email: `${body.username}@local`,
      role: "admin",
      lastSignInAt: new Date(),
    });

    console.log("[LOGIN] User di-upsert:", unionId);

    const token = await signSessionToken({
      unionId,
      clientId: "local",
    });

    console.log("[LOGIN] JWT dibuat");

    const cookieOpts = getSessionCookieOptions(c.req.raw.headers);

    setCookie(c, Session.cookieName, token, {
      ...cookieOpts,
      maxAge: Session.maxAgeMs / 1000,
    });

    console.log("[LOGIN] Cookie disimpan");

    return c.json({ success: true });
  };
}