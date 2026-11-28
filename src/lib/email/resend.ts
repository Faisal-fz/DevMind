import { Resend } from "resend";

let client: Resend | undefined;

// Created on first use so a missing key fails the send, not every import (e.g. at build time)
export function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not set");
    client = new Resend(apiKey);
  }
  return client;
}

// onboarding@resend.dev only delivers to the Resend account owner; set EMAIL_FROM to a verified domain for real use
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "DevMind <onboarding@resend.dev>";

export const APP_URL = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
