import { NextResponse } from "next/server";

type ApiError = {
  message: string;
  details?: unknown;
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function apiError(status: number, message: string, details?: unknown) {
  const error: ApiError = { message, details };
  return NextResponse.json({ data: null, error }, { status });
}
