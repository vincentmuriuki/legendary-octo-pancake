import { authenticator } from 'otplib'
import { NextResponse } from 'next/server'

export async function GET() {
    const secret = authenticator.generateSecret()
    return NextResponse.json({ secret })
}

