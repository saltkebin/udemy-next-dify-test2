import { NextRequest, NextResponse } from 'next/server'

const endpoint = `${process.env.DIFY_API_URL}/workflows/run`
const DIFY_API_KEY = process.env.DIFY_API_WORKFLOW_KEY

export async function GET(request: NextRequest) {
    
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('query')

        //DifyワークフローAPI接続
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: { 
                    //入力フィールドの変数名
                    query: query,
                },
                response_mode: 'streaming',
                user: 'abc-123',
            })
        })

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            }
        })
        
    } catch(error){
        console.error('APIエラー', error)
        return NextResponse.json({ error: 'Dify側でエラーが発生しました' }, { status: 500 })
    }
}