import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/lib/prisma';
import JSON5 from 'json5';

export async function POST(req: Request) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  const { entryId, content } = await req.json();

  const prompt = `Analyze journal entry sentiment. Return JSON in this exact format:
{
  "score": -1 to 1 (always include leading zero, e.g., 0.9 or -0.5),
  "keywords": ["three proper json strings"]
}
Ensure valid JSON with proper quotes and syntax.`;

  const requestData = {
    model: "gpt-4",
    messages: [{ role: "user", content: `${prompt}\n\n${content}` }],
    stream: true,
  };

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: requestData,
      responseType: 'stream',
    });

    let fullContent = '';

    const stream = new ReadableStream({
      start(controller) {
        response.data.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk);
          const text = chunk.toString();
          const lines = text.split('\n').filter(line => line.trim() && !line.includes('[DONE]'));

          lines.forEach(line => {
            try {
              const jsonStr = line.replace(/^data:\s*/, '');
              if (!jsonStr) return;

              const parsed = JSON.parse(jsonStr);
              if (parsed.choices?.[0]?.delta?.content) {
                fullContent += parsed.choices[0].delta.content;
              }
            } catch (e) {
              console.log('Stream chunk processing error:', e);
            }
          });
        });

        response.data.on('end', async () => {
          controller.close();
          try {
            // Clean up the content before attempting to parse
            const cleanContent = fullContent.trim();
            if (!cleanContent) {
              throw new Error('No content received from stream');
            }

            // Try to parse with JSON5 first, fall back to regular JSON
            let analysis;
            try {
              analysis = JSON5.parse(cleanContent);
            } catch (e) {
              // If JSON5 fails, try to extract and parse just the JSON object
              const jsonStart = cleanContent.indexOf('{');
              const jsonEnd = cleanContent.lastIndexOf('}');
              if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error('No valid JSON object found in response');
              }
              const jsonString = cleanContent.slice(jsonStart, jsonEnd + 1);
              analysis = JSON.parse(jsonString);
            }

            if (typeof analysis.score !== 'number' || !Array.isArray(analysis.keywords)) {
              throw new Error('Invalid analysis structure');
            }

            // Clean and validate data
            const cleanScore = Math.max(Math.min(analysis.score, 1), -1);
            const cleanKeywords = analysis.keywords
              .slice(0, 3)
              .map((k: any) => String(k).replace(/"/g, '').substring(0, 50));

            await prisma.sentiment.create({
              data: {
                entryId,
                score: cleanScore,
                keywords: cleanKeywords,
              },
            });
          } catch (error) {
            console.error('Final processing error:', error);
          }
        });

        response.data.on('error', (err: Error) => {
          console.error('Stream error:', err);
          controller.error(err);
        });
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}