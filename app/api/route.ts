export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    return Response.json({ ip: request.headers.get('cf-connecting-ip'), msg: 'Hello from the edge!', url: request.url})
}