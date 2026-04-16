import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'content', 'portfolio-data.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/admin/data
export async function GET(req: NextRequest) {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST /api/admin/data  (full replace)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    writeData(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
